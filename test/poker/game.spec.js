/*global describe, it, before, beforeEach, afterEach, after*/

var Game       = require('../../poker/game').Game,
    Tournament = require('../../poker/tournament').Tournament;

describe('Game class', function() {
var tournament, game;

  beforeEach(function() {
    tournament = new Tournament();
    game       = new Game(tournament);
  });

  it('should create new instance', function() {
    game.should.be.an.instanceOf(Game);
  });

  it('should have events', function(done) {
    game.on('event', done);
    game.emit('event');
  });

});