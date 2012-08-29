var Game = require("../lib/games").Game;

describe("Game class", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  it("should create new instance", function() {
    game.should.be.an.instanceOf( Game );
  });

  it("should have events", function(done) {
    game.on("event", function() {
      game.should.be.ok;
      done();
    });    
    game.emit("event");
  });

});