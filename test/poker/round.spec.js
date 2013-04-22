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
  var nexts, actions;

  beforeEach(function() {
    tournament = new Tournament();
    tournament.registerPlayer(1, 'Miki');
    tournament.registerPlayer(2, 'Giovana');
    tournament.registerPlayer(3, 'Sofia');
    tournament.registerPlayer(4, 'Bianca');
    nexts = [];
    tournament.on('round-next',  function() { nexts.push(tournament.game.round.positionToAct); });
    actions = [];
    tournament.on('round-raise', function(trmt, evt) { if (evt.type == 'regular') actions.push({position: evt.position, action: 'raise'}); });
    tournament.on('round-call',  function(trmt, evt) { actions.push({position: evt.position, action: 'call'}); });
    tournament.on('round-check', function(trmt, evt) { actions.push({position: evt.position, action: 'check'}); });
    tournament.on('round-fold',  function(trmt, evt) { actions.push({position: evt.position, action: 'fold'}); });
  });

  describe('after preflop round', function() {

    beforeEach(function() {
      tournament.on('tournament-button', function() { tournament.button = 1; });
    });

    it('should finish when nobody raises', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
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

    it('should finish when 1st to act raises', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
        actions.map(function(item) { return item.position }).should.eql([4, 1, 2, 3]);
        actions.map(function(item) { return item.action   }).should.eql(['raise', 'call', 'call', 'call']);
        done();
      });

      tournament.start();
      round = tournament.game.round;

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);
    });

    it('should finish when someone re-raises', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3, 4, 1] );
        actions.map(function(item) { return item.position }).should.eql(
          [4, 1, 2, 3, 4, 1]
        );
        actions.map(function(item) { return item.action   }).should.eql(
          ['raise', 'call', 'raise', 'fold', 'call', 'fold']
        );
        done();
      });

      tournament.start();
      round = tournament.game.round;

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 200);

      round.positionToAct.should.equal(3);
      round.fold(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.fold(round.positionToAct);
    });

  });

  describe('after flop round', function() {

    beforeEach(function() {
      tournament.on('round-start', function() {
        // overrides to force flop
        tournament.button = 1;
        tournament.game.round.number = 2;
        tournament.game.round.positionToAct = tournament.button;
      });
    });

    it('should finish when everybody checks', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1] );
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

    it('should finish when 1st to act raises', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1] );
        actions.map(function(item) { return item.position }).should.eql([2, 3, 4, 1]);
        actions.map(function(item) { return item.action   }).should.eql(['raise', 'call', 'call', 'call']);
        done();
      });

      tournament.start();
      round = tournament.game.round;

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);
    });

    it('should finish when someone re-raises', function(done) {
      tournament.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
        actions.map(function(item) { return item.position }).should.eql(
          [2, 3, 4, 1, 2, 3]
        );
        actions.map(function(item) { return item.action   }).should.eql(
          ['raise', 'call', 'raise', 'fold', 'call', 'fold']
        );
        done();
      });

      tournament.start();
      round = tournament.game.round;

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 200);

      round.positionToAct.should.equal(1);
      round.fold(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.fold(round.positionToAct);
    });


  });

});
