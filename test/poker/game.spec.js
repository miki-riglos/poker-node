/*global describe, it, before, beforeEach, afterEach, after*/

var Tournament = require('../../poker/tournament').Tournament,
    Game       = require('../../poker/game').Game;

describe('Game class', function() {
  var tournament, game;

  beforeEach(function() {
    tournament = new Tournament();
    game       = tournament.game;
  });

  it('should create new instance', function() {
    game.should.be.an.instanceOf(Game);
  });

  it('should have events', function(done) {
    game.on('event', done);
    game.emit('event');
  });

});