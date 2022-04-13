class TicTacToe {
  #n;
  #gameField;
  #moves;
  #winner;
  #move = 0;
  #symbols = { 0: "X", 1: "O" };
  #gameEnd = false;

  constructor(n) {
    n = n >= 3 ? n : 3;
    this.#n = n;
    this.#gameField = new Array(n)
      .fill(null)
      .map(() => new Array(n).fill(null));
    this.#moves = new Array();
    this.#createField(n);
  }

  #createField(n) {
    const field = document.querySelector(".game-field");
    field.innerHTML = "";
    for (let i = 0; i < n ** 2; i++) {
      const cell = document.createElement("div");
      cell.setAttribute("class", "game-field_cell");
      field.appendChild(cell);
    }
    field.style.gridTemplateColumns = `repeat(${n}, auto)`;
  }

  #checkIsWinHorizontal(row, symbol) {
    for (let i = 0; i < this.#n; i++) {
      if (this.#gameField[row][i] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #checkIsWinVertical(column, symbol) {
    for (let i = 0; i < this.#n; i++) {
      if (this.#gameField[i][column] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #checkIsWinLeftDiagonal(row, column, symbol) {
    if (row !== column) {
      return false;
    }
    for (let i = 0; i < this.#n; i++) {
      if (this.#gameField[i][i] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #checkIsWinRightDiagonal(row, column, symbol) {
    if (row !== this.#n - 1 - column) {
      return false;
    }
    for (let i = 0; i < this.#n; i++) {
      if (this.#gameField[i][this.#n - 1 - i] !== symbol) {
        return false;
      }
    }
    return true;
  }

  #isWin(row, column, symbol) {
    return (
      this.#checkIsWinHorizontal(row, symbol) ||
      this.#checkIsWinVertical(column, symbol) ||
      this.#checkIsWinLeftDiagonal(row, column, symbol) ||
      this.#checkIsWinRightDiagonal(row, column, symbol)
    );
  }

  #isDraw() {
    for (let i = 0; i < this.#n; i++) {
      for (let j = 0; j < this.#n; j++) {
        if (this.#gameField[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  getSymbol() {
    return this.#symbols[this.#move % 2];
  }

  getWinner() {
    return this.#winner;
  }

  getN() {
    return this.#n;
  }

  isEmptyCell(row, column) {
    return this.#gameField[row][column] === null;
  }

  isGameEnd() {
    return this.#gameEnd;
  }

  get moveNumber() {
    return this.move;
  }

  get doneMoves() {
    return this.#moves;
  }

  makeMove(row, column) {
    const symbol = this.getSymbol();
    this.#gameField[row][column] = symbol;
    if (this.#moves.length > this.#move) {
      this.#moves = this.#moves.slice(0, this.#move);
    }
    this.#moves[this.#move] = [row, column];
    this.#move++;
    this.printResult(row, column, symbol);
  }

  printResult(row, column, symbol) {
    if (this.#isWin(row, column, symbol)) {
      this.#winner = symbol;
      this.printWinner("Winner is " + this.#winner + "!");
      this.#gameEnd = true;
      this.#highlightWinnerCells(row, column);
    } else if (this.#isDraw()) {
      this.printWinner("Draw!");
      this.#gameEnd = true;
    }
  }

  goBack() {
    if (this.#move === 0) {
      return;
    }
    this.#move--;
    const [row, column] = this.#moves[this.#move];
    this.#gameField[row][column] = null;
    document.querySelectorAll(".game-field_cell")[
      row * this.#n + column
    ].innerHTML = "";
    if (this.#gameEnd) {
      this.#gameEnd = false;
      this.#winner = undefined;
      document.querySelector(".winner").remove();
      this.#removeHiglight();
    }
  }

  goForward() {
    if (this.#move === this.#moves.length) {
      return;
    }
    const [row, column] = this.#moves[this.#move];
    this.#gameField[row][column] = this.getSymbol(this.#move);
    this.markCell(
      document.querySelectorAll(".game-field_cell")[row * this.#n + column],
      this.#gameField[row][column]
    );
    this.printResult(row, column, this.getSymbol(this.#move));
    this.#highlightWinnerCells(row, column);
    this.#move++;
  }

  printWinner(str) {
    const div = document.createElement("div");
    div.innerText = str;
    div.setAttribute("class", "winner");
    document
      .querySelector(".buttons")
      .parentNode.insertBefore(div, document.querySelector(".buttons"));
  }

  markCell(cell, symbol) {
    const symb = symbol === "X" ? "cross" : "circle";
    const img = document.createElement("img");
    img.setAttribute("class", `${symb}`);
    img.setAttribute("src", `img/${symb}.svg`);
    cell.appendChild(img);
  }

  #highlightWinnerCells(row, column) {
    const symbol = this.#gameField[row][column];
    const gameFileds = document.querySelectorAll(".game-field_cell");
    if (this.#checkIsWinHorizontal(row, symbol)) {
      this.#highlightHorizontal(row, gameFileds);
      return;
    }
    if (this.#checkIsWinVertical(column, symbol)) {
      this.#highlightVertical(column, gameFileds);
      return;
    }
    if (this.#checkIsWinLeftDiagonal(row, column, symbol)) {
      this.#highlightLeftDiagonal(gameFileds);
      return;
    }
    if (this.#checkIsWinRightDiagonal(row, column, symbol)) {
      this.#highlighRightDiagonal(gameFileds);
      return;
    }
  }

  #highlightHorizontal(row, gameFileds) {
    for (let i = 0; i < this.#n; i++) {
      gameFileds[row * this.#n + i].classList.add("win-cell");
    }
  }

  #highlightVertical(column, gameFileds) {
    for (let i = 0; i < this.#n; i++) {
      gameFileds[this.#n * i + column].classList.add("win-cell");
    }
  }

  #highlightLeftDiagonal(gameFileds) {
    for (let i = 0; i < this.#n; i++) {
      gameFileds[this.#n * i + i].classList.add("win-cell");
    }
  }

  #highlighRightDiagonal(gameFileds) {
    for (let i = 0; i < this.#n; i++) {
      gameFileds[this.#n * (i + 1) - (i + 1)].classList.add("win-cell");
    }
  }

  #removeHiglight() {
    for (gameField of document.querySelectorAll(".game-field_cell")) {
      gameField.classList.remove("win-cell");
    }
  }
}

function runGame(game) {
  const gameFields = document.querySelectorAll(".game-field_cell");
  for (gameField of gameFields) {
    gameField.addEventListener("click", (event) => {
      const cell = event.target;
      const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
      let row = (cellIndex - (cellIndex % game.getN())) / game.getN();
      let column = cellIndex % game.getN();
      if (game.isGameEnd() || !game.isEmptyCell(row, column)) {
        return;
      }
      game.markCell(cell, game.getSymbol());
      game.makeMove(row, column);
      
      if (game.isGameEnd()) {
        return;
      }
      let move = getRndInteger(0, (game.getN() ** 2) - 1);
      row = (move - (move % game.getN())) / game.getN();
      column = move % game.getN();
      while (!game.isEmptyCell(row, column)) {
        move = getRndInteger(0, (game.getN() ** 2) - 1);
        row = (move - (move % game.getN())) / game.getN();
        column = move % game.getN();
      }
      game.markCell(gameFields[move], game.getSymbol());
      game.makeMove((move - (move % game.getN())) / game.getN(), move % game.getN());
    });
  }

}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener("DOMContentLoaded", () => {
  let game = new TicTacToe(3);
  runGame(game);

  document.querySelector(".reset-button").addEventListener("click", () => {
    const gameField = document.querySelector(".game-field");
    for (const cell of gameField.childNodes) {
      cell.innerHTML = "";
    }
    if (game.isGameEnd()) {
      document.querySelector(".winner").remove();
    }
    let n = parseInt(document.querySelector(".dims").value);
    n = isNaN(n) ? game.getN() : n;
    document.querySelector(".dims").value = n;
    game = new TicTacToe(n);
    runGame(game);
  });

  document.querySelector(".back-button").addEventListener("click", () => {
    game.goBack();
  });

  document.querySelector(".forward-button").addEventListener("click", () => {
    game.goForward();
  });
});
