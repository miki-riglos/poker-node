var Player = require("../lib/players").Player;

describe("Player class", function() {

  it("should create new instance", function() {
    var player = new Player("Phil", 10000);
    expect( player ).toBeInstanceOf( Player );
  });

});
