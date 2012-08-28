var Game = require("../lib/games").Game;

describe("Game class", function() {

  it("should create new instance", function() {
    var game = new Game();
    game.should.be.an.instanceOf( Game );
  });

});