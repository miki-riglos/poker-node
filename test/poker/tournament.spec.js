/*global describe, it, before, beforeEach, afterEach, after*/
var _ = require('underscore');

var Tournament = require('../../poker/tournament').Tournament,
    Game       = require('../../poker/game').Game,
    Deck       = require('../../poker/deck').Deck,
    Card       = require('../../poker/deck').Card;

var keys = Object.keys;

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

  describe('Deserialization', function() {
    var tournamentSte,
        tournamentIns;

    beforeEach(function() {
      tournament.registerPlayer(1, 'Sofia');
      tournament.registerPlayer(2, 'Bianca');
    });

    it('should deserialize when tournament has not started', function() {
      tournamentSte = JSON.parse( JSON.stringify(tournament) );
      tournamentIns = new Tournament(tournamentSte);
      tournamentIns.should.be.an.instanceOf(Tournament);
      tournamentIns.should.eql(tournament);
    });

    it('should deserialize after tournament has started', function() {
      tournament.start();
      tournamentSte = JSON.parse( JSON.stringify(tournament) );
      tournamentIns = new Tournament(tournamentSte);

      // Tournament
      tournamentIns.should.be.an.instanceOf(Tournament);
      var tournamentOmits = ['players', 'game', '_events'];
      _.omit(tournamentIns, tournamentOmits).should.eql( _.omit(tournament, tournamentOmits) );

      // Players
      keys(tournament.players).forEach(function(position) {
        // omit methods
        _.omit(tournamentIns.players[position], _.functions(tournamentIns.players[position])).should.eql(
           _.omit(tournament.players[position], _.functions(tournament.players[position]))
          );
        // methods
        _.functions(tournamentIns.players[position]).should.eql(
           _.functions(tournament.players[position]) );
      });

      // Game
      tournamentIns.game.should.be.an.instanceOf(Game);
      // gamePlayers
      keys(tournament.game.gamePlayers).forEach(function(position) {
        tournamentIns.game.gamePlayers[position].hand[0].should.be.an.instanceOf(Card);
        tournamentIns.game.gamePlayers[position].hand[1].should.be.an.instanceOf(Card);
        tournamentIns.game.gamePlayers[position].should.eql( tournament.game.gamePlayers[position] );
      });

      tournamentIns.game.deck.should.be.an.instanceOf(Deck);
    // deck        : [],     // Deck, Card[]
    // flop        : [],     // Card
    // turn        : {},     // Card
    // river       : {},     // Card
    // burnt       : [],     // Card[]

      // Round

    });
  });

});