class TicTacToe {
  #size;
  #field;
  #currentMove = 0;
  #symbols = { 0: "X", 1: "O" };
  #movesList = [];
  #undoMovesList = [];

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
      this.isDraw &&
      this.#isWin(this.#symbols[0]) &&
      this.#isWin(this.#symbols[1])
    );
  }

  isPossibleMove(position) {
    return position < this.#field.length && !this.#field[position];
  }

  #isWinHorizontal(symbol) {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.#field[this.size * row + column] !== symbol) {
          return false;
        }
      }
      return true;
    }
  }

  #isWinVertical(symbol) {
    for (let column = 0; column < this.size; column++) {
      for (let row = 0; row < this.size; row++) {
        if (this.#field[this.size * row + column] !== symbol) {
          return false;
        }
      }
      return true;
    }
  }

  #isWinLeftDiagonal(symbol) {
    for (let position = 0; position < this.size; position += this.size + 1) {
      if (this.#field[position] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #isWinRightDiagonal(symbol) {
    for (
      let position = this.size - 1;
      position > 0;
      position += this.size - 1
    ) {
      if (this.#field[position] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #isWin(symbol) {
    return (
      this.#isWinHorizontal(symbol) ||
      this.#isWinVertical(symbol) ||
      this.#isWinLeftDiagonal(symbol) ||
      this.#isWinRightDiagonal(symbol)
    );
  }

  isDraw() {
    return !this.#field.includes(null);
  }

  makeMove(position) {
    if (this.isFinished) {
      throw Error();
    }
    if (this.isPossibleMove) {
      throw Error();
    }
    this.#field[position] = this.currentSymbol;
    this.#movesList.push(position);
    this.#undoMovesList = [];
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
  }

  redo() {
    if (this.#undoMovesList.length === 0) {
      return;
    }
    const moveToUndo = this.#undoMovesList.pop();
    this.#field[moveToUndo] = this.currentSymbol;
    this.#movesList.push(moveToUndo);
    this.#currentMove++;
  }
}

module.exports = TicTacToe;
