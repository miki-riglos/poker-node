/*global describe, it, before, beforeEach, afterEach, after*/

var Game       = require('../../poker/game').Game,
    Table = require('../../poker/table').Table;

describe('Game class', function() {
var table, game;

  beforeEach(function() {
    table = new Table();
    game       = new Game(table);
  });

  it('should create new instance', function() {
    game.should.be.an.instanceOf(Game);
  });

  it('should have events', function(done) {
    game.on('event', done);
    game.emit('event');
  });

});