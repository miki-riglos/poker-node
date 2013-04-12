/*global describe, it, before, beforeEach, afterEach, after*/
var keys = Object.keys;

var Tournament = require('../../poker/tournament').Tournament;

describe('Tournament class', function() {
  var tournament;

  beforeEach(function() {
    tournament = new Tournament();
  });

  it('should create new instance', function() {
    tournament.should.be.an.instanceOf(Tournament);
  });

  it('should have events', function(done) {
    tournament.on('event', done);
    tournament.emit('event');
  });

  describe('Registration', function() {

    it('should allow players registration', function() {
      tournament.registerPlayer(1, 'Sofia').errorMessage.should.be.empty;
      tournament.registerPlayer(2, 'Bianca').errorMessage.should.be.empty;
      keys(tournament.players).should.have.lengthOf(2);
    });

    it('should validate position uniqueness', function() {
      tournament.registerPlayer(1, 'Sofia').errorMessage.should.be.empty;
      tournament.registerPlayer(1, 'Bianca').errorMessage.should.equal('Position 1 already taken');
    });

    it('should validate position minimum and maximum', function() {
      tournament.registerPlayer(0, 'Sofia').errorMessage.should.not.be.empty;
      tournament.registerPlayer(11, 'Sofia').errorMessage.should.not.be.empty;
    });

    it('should allow registration only if tournament has not started', function() {
        tournament.registerPlayer(1, 'Sofia').errorMessage.should.be.empty;
        tournament.registerPlayer(2, 'Bianca').errorMessage.should.be.empty;
        tournament.start();
        tournament.registerPlayer(3, 'Giovana').errorMessage.should.not.be.empty;
    });

    it('should not allow registration if maximum number of players are registered', function() {
      var i = 0;
      while (++i <= tournament.options.maximumPlayers) {
        tournament.registerPlayer(i, 'Player' + i);
      }

      tournament.registerPlayer(11, 'Player 11').errorMessage.should.not.be.empty;
    });

  });

});