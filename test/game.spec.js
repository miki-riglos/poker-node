var Game = require("../lib/game").Game;

describe("Game class", function() {
  var game;

  beforeEach(function() {
    game = new Game(1, 1, {}, {}, []);
  });

  it("should create new instance", function() {
    game.should.be.an.instanceOf(Game);
  });

  it("should have events", function(done) {
    game.on("event", done);
    game.emit("event");
  });

});