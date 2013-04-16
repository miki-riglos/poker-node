/*global describe, it, before, beforeEach, afterEach, after*/

var Round      = require('../../poker/round').Round,
    Game       = require('../../poker/game').Game,
    Tournament = require('../../poker/tournament').Tournament;

var tournament, game, round;

describe('Round class', function() {

  beforeEach(function() {
    tournament = new Tournament();
    game       = new Game(tournament);
    round      = new Round(game);
  });

  it('should create new instance', function() {
    round.should.be.an.instanceOf(Round);
  });

  it('should have events', function(done) {
    round.on('event', done);
    round.emit('event');
  });
});

describe('nextPosition method', function() {
  var actions;

  beforeEach(function() {
    tournament = new Tournament();
    tournament.registerPlayer(1, 'Miki');
    tournament.registerPlayer(2, 'Giovana');
    tournament.registerPlayer(3, 'Sofia');
    tournament.registerPlayer(4, 'Bianca');
  });

  it.skip('should finish preflop round when nobody raises', function(done) {
    actions = [];
    tournament.on('tournament-button', function() { tournament.button = 1; });

    tournament.on('round-call',  function(trnm, evt) { actions.push({position: evt.position, action: 'call'}); });
    tournament.on('round-check', function(trnm, evt) { actions.push({position: evt.position, action: 'check'}); });

    tournament.on('round-end', function() {
      actions.map(function(item) { return item.position }).should.eql([4, 1, 2, 3]);
      actions.map(function(item) { return item.action   }).should.eql(['call', 'call', 'call', 'check']);
      done();
    });

    tournament.start();
    round = tournament.game.round;

    round.positionToAct.should.equal(4);
    round.call(round.positionToAct);

    round.positionToAct.should.equal(1);
    round.call(round.positionToAct);

    round.positionToAct.should.equal(2);
    round.call(round.positionToAct);

    round.positionToAct.should.equal(3);
    round.check(round.positionToAct);
  });

  it('should finish flop round when everybody checks', function(done) {
    actions = [];
    tournament.on('round-start', function() {
      // overrides to force flop
      tournament.button = 1;
      tournament.game.round.number = 2;
      tournament.game.round.positionToAct = tournament.button;
    });

    tournament.on('round-check', function(trnm, evt) { actions.push({position: evt.position, action: 'check'}); });

    tournament.on('round-end', function() {
      actions.map(function(item) { return item.position }).should.eql([2, 3, 4, 1]);
      actions.map(function(item) { return item.action   }).should.eql(['check', 'check', 'check', 'check']);
      done();
    });

    tournament.start();
    round = tournament.game.round;

    round.positionToAct.should.equal(2);
    round.check(round.positionToAct);

    round.positionToAct.should.equal(3);
    round.check(round.positionToAct);

    round.positionToAct.should.equal(4);
    round.check(round.positionToAct);

    round.positionToAct.should.equal(1);
    round.check(round.positionToAct);
  });

});
