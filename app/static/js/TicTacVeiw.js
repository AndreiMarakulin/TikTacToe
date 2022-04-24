export class TicTacToeView {
  #cells;
  #size;
  gameEnd;

  constructor() {
    this.field = document.querySelector(".game-field");
    this.undoButton = document.querySelector(".back-button");
    this.redoButton = document.querySelector(".forward-button");
    this.resetButton = document.querySelector(".reset-button");
    this.resizeButton = document.querySelector(".resize-button");
    this.sizeInput = document.querySelector(".dims");
    this.gameEnd = false;
  }

  createField(size) {
    this.field.innerHTML = "";
    for (let i = 0; i < size ** 2; i++) {
      const cell = document.createElement("div");
      cell.setAttribute("class", "game-field_cell");
      this.field.appendChild(cell);
    }
    this.field.style.gridTemplateColumns = `repeat(${size}, auto)`;
    this.#cells = document.querySelectorAll(".game-field_cell");
    this.#size = size;
  }

  markCell(position, symbol) {
    const mark = symbol === "X" ? this.#createCross() : this.#createCircle();
    this.#cells[position].appendChild(mark);
  }

  clearCell(position) {
    this.#cells[position].innerHTML = "";
  }

  resetField() {
    for (const cell of this.#cells) {
      cell.innerHTML = "";
    }
  }

  cellPosition(cell) {
    return Array.from(this.#cells).indexOf(cell);
  }

  #createCross() {
    const svg = document.createElement("img");
    svg.setAttribute("class", `cross`);
    svg.setAttribute("src", `img/cross.svg`);
    return svg;
  }

  #createCircle() {
    const svg = document.createElement("img");
    svg.setAttribute("class", `circle`);
    svg.setAttribute("src", `img/circle.svg`);
    return svg;
  }

  get newFieldSize() {
    let newSize = parseInt(this.sizeInput.value);
    newSize = isNaN(newSize) ? this.#size : newSize;
    newSize = newSize < 3 ? 3 : newSize;
    newSize = newSize > 7 ? 7 : newSize;
    this.sizeInput.value = newSize;
    return newSize;
  }

  hightlightWinner(winnerPosition) {
    switch (winnerPosition.type) {
      case "row":
        for (let i = 0; i < this.#size; i++) {
          this.#cells[winnerPosition.row * this.#size + i].classList.add(
            "win-cell"
          );
        }
        break;
      case "column":
        for (let i = 0; i < this.#size; i++) {
          this.#cells[winnerPosition.column + this.#size * i].classList.add(
            "win-cell"
          );
        }
        break;
      case "leftDiagonal":
        for (let i = 0; i < this.#size; i++) {
          this.#cells[this.#size * i + i].classList.add("win-cell");
        }
        break;
      case "rightDiagonal":
        for (let i = 0; i < this.#size; i++) {
          this.#cells[this.#size * (i + 1) - (i + 1)].classList.add("win-cell");
        }
        break;
    }
  }
  removeHiglight() {
    for (const cell of this.#cells) {
      cell.classList.remove("win-cell");
    }
  }

  printResult(text) {
    const div = document.createElement("div");
    div.innerText = text;
    div.setAttribute("class", "winner");
    document
      .querySelector(".buttons")
      .parentNode.insertBefore(div, document.querySelector(".buttons"));
  }

  removeResult() {
    document.querySelector(".winner").remove();
  }
}

export class markCellsObserver {
  constructor(view) {
    this.view = view;
  }

  handle(data) {
    switch (data.action) {
      case "move":
        this.view.markCell(data.position, data.player);
        break;
      case "undo":
        this.view.clearCell(data.position);
        if (this.view.gameEnd) {
          this.view.removeHiglight();
          this.view.removeResult();
          this.view.gameEnd = false;
        }
        break;
      case "redo":
        this.view.markCell(data.position, data.player);
        break;
      case "win":
        this.view.hightlightWinner(data.winnerPosition);
        this.view.printResult(`Winner is ${data.winner}!`);
        this.view.gameEnd = true;
        break;
      case "draw":
        this.view.printResult(`Draw!`);
        this.view.gameEnd = true;
        break;
    }
  }
}
