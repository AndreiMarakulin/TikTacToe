import TicTacToe from "./TicTacToe.js";
import {
  TicTacToeView,
  markCellsObserver,
  webSocketObserver,
} from "./TicTacVeiw.js";
const socket = io();

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
    game = createNewGame(view, game.size);
    view.resetField();
    socket.emit("action", { action: "reset" });
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

  socket.on("action", (msg) => {
    if (msg.action !== "reset") {
      game.notify(msg, true);
    } else {
      game = createNewGame(view, game.size);
      view.resetField();
    }
  });

  socket.on("connect", () => {
    console.log("Conncted");
  });
});

const createNewGame = (view, size = 3) => {
  const game = new TicTacToe(size);
  game.attach(new markCellsObserver(view));
  game.attach(new webSocketObserver(socket));
  return game;
};
