/*global describe, it, before, beforeEach, afterEach, after*/

var Player = require('../../poker/player').Player;

describe('Player class', function() {

  it('should create new instance', function() {
    var player = Player('Sofia', 10000);
    player.should.be.an.instanceOf(Player);
  });

});