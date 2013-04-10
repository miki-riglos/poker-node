/*global describe, it, before, beforeEach, afterEach, after*/

var Round      = require('../../poker/round').Round,
    Tournament = require('../../poker/tournament').Tournament;

var round;

describe('Round class', function() {

  beforeEach(function() {
    round = Round(1, 1, {}, {}, {}, []);
  });

  it('should create new instance', function() {
    round.should.be.an.instanceOf(Round);
  });

  it('should have events', function(done) {
    round.on('event', done);
    round.emit('event');
  });
});

describe('nextPosition', function() {
  var tournament;

  beforeEach(function() {
    tournament = Tournament();
    tournament.registerPlayer(1, 'Miki');
    tournament.registerPlayer(2, 'Giovana');
    tournament.registerPlayer(3, 'Sofia');
    tournament.registerPlayer(4, 'Bianca');
  });

  it('should finish preflop round when nobody raises', function(done) {
    var roundEnding = false;
    tournament.on('tournament-button', function() {
      tournament.button = 1;
    });
    tournament.on('round-end', function() {
      roundEnding.should.equal(true);
      done();
    });
    tournament.start();
    round = tournament.currentGame.currentRound;

    round.positionToAct.should.equal(4);
    round.call(round.positionToAct);

    round.positionToAct.should.equal(1);
    round.call(round.positionToAct);

    round.positionToAct.should.equal(2);
    round.call(round.positionToAct);

    roundEnding = true;
    round.positionToAct.should.equal(3);
    round.check(round.positionToAct);
  });
});
