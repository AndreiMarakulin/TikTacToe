const TicTacToe = require("../TicTacToe.js");

describe("TicTacToe class", () => {
  test("Get field size (default size)", () => {
    const game = new TicTacToe();
    expect(game.size).toBe(3);
  });
  test("Get field size (given size)", () => {
    const game = new TicTacToe(5);
    expect(game.size).toBe(5);
  });
  test("Get field size (size less then 3)", () => {
    const game = new TicTacToe(1);
    expect(game.size).toBe(3);
  });
  test("Get current move number", () => {
    const game = new TicTacToe();
    expect(game.currentMove).toBe(0)
  })
  test("Get current symbol", () => {
    const game = new TicTacToe();
    expect(game.currentSymbol).toBe('X')
  })
})