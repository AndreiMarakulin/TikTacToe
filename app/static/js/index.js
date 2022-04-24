import TicTacToe from "./TicTacToe.js";
import { TicTacToeView, markCellsObserver } from "./TicTacVeiw.js";

window.addEventListener("DOMContentLoaded", () => {
  const view = new TicTacToeView();
  let game = createNewGame(view);
  view.createField(game.size);

  view.field.addEventListener("click", (event) => {
    const cell = event.target.closest(`.game-field_cell`);
    game.makeMove(view.cellPosition(cell));
  });

  view.undoButton.addEventListener("click", () => {
    game.undo();
  });

  view.redoButton.addEventListener("click", () => {
    game.redo();
  });

  view.resetButton.addEventListener("click", () => {
    view.resetField();
    if (view.gameEnd) {
      view.removeHiglight();
      view.removeResult();
      view.gameEnd = false;
    }
    game = createNewGame(view, game.size);
  });

  view.resizeButton.addEventListener("click", () => {
    game = createNewGame(view, view.newFieldSize);
    view.createField(game.size);
    if (view.gameEnd) {
      view.removeHiglight();
      view.removeResult();
      view.gameEnd = false;
    }
  });
});

const createNewGame = (view, size = 3) => {
  const game = new TicTacToe(size);
  game.attach(new markCellsObserver(view));
  return game;
};
