var Player = require("../lib/player").Player;

describe("Player class", function() {

  it("should create new instance", function() {
    var player = new Player("Sofia", 10000);
    player.should.be.an.instanceOf(Player);
  });

});