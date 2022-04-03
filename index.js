class TicTacToe {
  #n;
  #gameField;
  #winner;
  #move = 1;
  #symbols = { 0: "O", 1: "X" };
  #gameEnd = false;
  #moves = {};

  constructor(n) {
    if (n < 3) {
      n = 3;
    }
    this.#n = n;
    this.#gameField = new Array(n)
      .fill(null)
      .map(() => new Array(n).fill(null));
    this.#moves[0] = this.#gameField.map((arr) => {
      return arr.slice();
    });
    this.#createField(n);
  }

  #createField(n) {
    const field = document.querySelector(".game-field");
    field.innerHTML = "";
    for (let i = 0; i < n * n; i++) {
      let cell = document.createElement("div");
      cell.setAttribute("class", "game-field_cell");
      field.appendChild(cell);
    }
    field.style.gridTemplateColumns = "repeat(" + n + ", auto)";
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

  #checkIsWinDiagonal(row, column, symbol) {
    if (row !== column && row !== this.#n - 1 - column) {
      return false;
    }
    if (row === column) {
      for (let i = 0; i < this.#n; i++) {
        if (this.#gameField[i][i] !== symbol) {
          return false;
        }
      }
    }
    if (row === this.#n - 1 - column) {
      for (let i = 0; i < this.#n; i++) {
        if (this.#gameField[i][this.#n - 1 - i] !== symbol) {
          return false;
        }
      }
    }
    return true;
  }

  #isWin(row, column, symbol) {
    return (
      this.#checkIsWinHorizontal(row, symbol) ||
      this.#checkIsWinVertical(column, symbol) ||
      this.#checkIsWinDiagonal(row, column, symbol)
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

  makeMove(row, column) {
    let symbol = this.getSymbol();
    if (this.#winner !== undefined) {
      console.log("Winner is ", this.#winner);
      return;
    }
    this.#gameField[row][column] = symbol;
    this.#moves[this.#move] = this.#gameField.map((arr) => {
      return arr.slice();
    });
    this.#move++;
    this.printResult(row, column, symbol);
  }

  printResult(row, column, symbol) {
    if (this.#isWin(row, column, symbol)) {
      this.#winner = symbol;
      this.printWinner("Winner is " + this.#winner + "!");
      this.#gameEnd = true;
    } else if (this.#isDraw()) {
      this.printWinner("Draw!");
      this.#gameEnd = true;
    }
  }

  goBack() {
    if (this.#move === 1) {
      return;
    }
    this.#move--;
    this.#gameField = this.#moves[this.#move - 1];
    let cells = document.querySelectorAll(".game-field_cell");
    for (let i = 0; i < this.#n; i++) {
      for (let j = 0; j < this.#n; j++) {
        if (this.#gameField[i][j] === null) {
          cells[i * this.#n + j].innerHTML = "";
        }
      }
    }
    if (this.#gameEnd) {
      this.#gameEnd = false;
      this.#winner = undefined;
      document.querySelector(".winner").remove();
    }
  }

  goForward() {
    if (this.#move === Object.keys(this.#moves).length) {
      return;
    }
    this.#gameField = this.#moves[this.#move];
    let cells = document.querySelectorAll(".game-field_cell");
    for (let i = 0; i < this.#n; i++) {
      for (let j = 0; j < this.#n; j++) {
        if (
          this.#gameField[i][j] !== null &&
          cells[i * this.#n + j].innerHTML === ""
        ) {
          this.markCell(cells[i * this.#n + j], this.#gameField[i][j]);
          this.printResult(i, j, this.#gameField[i][j]);
        }
      }
    }
    this.#move++;
  }

  printWinner(str) {
    let div = document.createElement("div");
    div.innerText = str;
    div.setAttribute("class", "winner");
    document
      .querySelector(".buttons")
      .parentNode.insertBefore(div, document.querySelector(".buttons"));
  }

  markCell(cell, symbol) {
    let img = document.createElement("img");
    if (symbol === "X") {
      img.setAttribute("class", "cross");
      img.setAttribute("src", "img/cross.svg");
    } else {
      img.setAttribute("class", "circle");
      img.setAttribute("src", "img/circle.svg");
    }
    cell.appendChild(img);
  }
}

function runGame(game) {
  let gameFields = document.querySelectorAll(".game-field_cell");
  for (gameField of gameFields) {
    gameField.addEventListener("click", (event) => {
      let cell = event.target;
      if (cell.className !== "game-field_cell") {
        return;
      }
      let cellIndex = getIndexOfElement(cell);
      const n = game.getN();
      if (
        game.isGameEnd() ||
        !game.isEmptyCell((cellIndex - (cellIndex % n)) / n, cellIndex % n)
      ) {
        return;
      }
      game.markCell(cell, game.getSymbol());

      game.makeMove((cellIndex - (cellIndex % n)) / n, cellIndex % n);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game = new TicTacToe(3);
  runGame(game);

  document.querySelector(".reset-button").addEventListener("click", () => {
    let gameField = document.querySelector(".game-field");
    for (let cell of gameField.childNodes) {
      cell.innerHTML = "";
    }
    if (game.isGameEnd()) {
      document.querySelector(".winner").remove();
    }
    game = new TicTacToe(parseInt(document.querySelector(".dims").value));
    runGame(game);
  });

  document.querySelector(".back-button").addEventListener("click", () => {
    game.goBack();
  });

  document.querySelector(".forward-button").addEventListener("click", () => {
    game.goForward();
  });
});

function getIndexOfElement(node) {
  return Array.from(node.parentNode.children).indexOf(node);
}