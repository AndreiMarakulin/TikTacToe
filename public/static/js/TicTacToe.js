export default class TicTacToe {
  #size;
  #field;
  #currentMove = 0;
  #symbols = { 0: "X", 1: "O" };
  #movesList = [];
  #undoMovesList = [];
  #Observers = [];

  constructor(size = 3) {
    this.#size = size >= 3 ? size : 3;
    this.#field = new Array(this.#size ** 2).fill(null);
  }

  get size() {
    return this.#size;
  }
  get currentMove() {
    return this.#currentMove;
  }

  get currentSymbol() {
    return this.#symbols[this.currentMove % 2];
  }

  isFinished() {
    return (
      this.isDraw() ||
      this.#isWin(this.#symbols[0]) ||
      this.#isWin(this.#symbols[1])
    );
  }

  isPossibleMove(position) {
    return position < this.#field.length && !this.#field[position];
  }

  #isWinHorizontal(symbol) {
    for (let row = 0; row < this.size; row++) {
      let isWin = true;
      for (let column = 0; column < this.size; column++) {
        if (this.#field[this.size * row + column] !== symbol) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return [true, row];
      }
    }
    return [false];
  }

  #isWinVertical(symbol) {
    for (let column = 0; column < this.size; column++) {
      let isWin = true;
      for (let row = 0; row < this.size; row++) {
        if (this.#field[this.size * row + column] !== symbol) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return [true, column];
      }
    }
    return [false];
  }

  #isWinLeftDiagonal(symbol) {
    for (
      let position = 0;
      position < this.size ** 2;
      position += this.size + 1
    ) {
      if (this.#field[position] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #isWinRightDiagonal(symbol) {
    for (
      let position = this.size ** 2 - this.size;
      position > 0;
      position -= this.size - 1
    ) {
      if (this.#field[position] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #isWin(symbol) {
    return (
      this.#isWinHorizontal(symbol)[0] ||
      this.#isWinVertical(symbol)[0] ||
      this.#isWinLeftDiagonal(symbol) ||
      this.#isWinRightDiagonal(symbol)
    );
  }

  winnerPosition(symbol) {
    if (this.#isWinHorizontal(symbol)[0]) {
      return { type: "row", row: this.#isWinHorizontal(symbol)[1] };
    }
    if (this.#isWinVertical(symbol)[0]) {
      return { type: "column", column: this.#isWinVertical(symbol)[1] };
    }
    if (this.#isWinLeftDiagonal(symbol)) {
      return { type: "leftDiagonal" };
    }
    if (this.#isWinRightDiagonal(symbol)) {
      return { type: "rightDiagonal" };
    }
  }

  isDraw() {
    return !this.#field.includes(null);
  }

  makeMove(position) {
    if (this.isFinished()) {
      return;
    }
    if (!this.isPossibleMove(position)) {
      return;
    }
    this.#field[position] = this.currentSymbol;
    this.#movesList.push(position);
    this.#undoMovesList = [];
    this.notify({
      action: "move",
      player: this.#field[position],
      position: position,
    });

    if (this.#isWin(this.currentSymbol)) {
      this.notify({
        action: "win",
        winner: this.currentSymbol,
        winnerPosition: this.winnerPosition(this.currentSymbol),
        gameMoves: this.#movesList,
      });
    } else if (this.isDraw()) {
      this.notify({
        action: "draw",
        gameMoves: this.#movesList,
      });
    }
    this.#currentMove++;
  }

  undo() {
    if (this.#movesList.length === 0) {
      return;
    }
    const lastMove = this.#movesList.pop();
    this.#field[lastMove] = null;
    this.#undoMovesList.push(lastMove);
    this.#currentMove--;
    this.notify({
      action: "undo",
      position: lastMove,
    });
  }

  redo() {
    if (this.#undoMovesList.length === 0) {
      return;
    }
    const moveToUndo = this.#undoMovesList.pop();
    this.#field[moveToUndo] = this.currentSymbol;
    this.#movesList.push(moveToUndo);
    if (this.#isWin(this.currentSymbol)) {
      this.notify({
        action: "win",
        winner: this.currentSymbol,
        winnerPosition: this.winnerPosition(this.currentSymbol),
      });
    } else if (this.isDraw()) {
      this.notify({
        action: "draw",
      });
    }
    this.notify({
      action: "redo",
      player: this.#field[moveToUndo],
      position: moveToUndo,
    });
    this.#currentMove++;
  }

  attach(observer) {
    this.#Observers.push(observer);
  }

  dettach(observer) {
    this.#Observers = this.#Observers.filter((obs) => obs !== observer);
  }

  notify(data, reflection = false) {
    this.#Observers.forEach((observer) => {
      observer.handle(data, reflection);
    });
    if (reflection) {
      this.#reflect(data);
    }
  }

  #reflect(data) {
    switch (data.action) {
      case "move":
        this.#field[data.position] = this.currentSymbol;
        this.#movesList.push(data.position);
        this.#undoMovesList = [];
        this.#currentMove++;
        break;
      case "undo":
        const lastMove = this.#movesList.pop();
        this.#field[lastMove] = null;
        this.#undoMovesList.push(lastMove);
        this.#currentMove--;
        break;
      case "redo":
        const moveToUndo = this.#undoMovesList.pop();
        this.#field[moveToUndo] = this.currentSymbol;
        this.#movesList.push(moveToUndo);
        this.#currentMove++;
        break;
    }
  }
}
