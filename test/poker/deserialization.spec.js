/*global describe, it, before, beforeEach, afterEach, after*/
var _ = require('underscore');

var Tournament = require('../../poker/tournament').Tournament,
    Game       = require('../../poker/game').Game,
    Round      = require('../../poker/round').Round,
    Deck       = require('../../poker/deck').Deck,
    Card       = require('../../poker/deck').Card;

var keys = Object.keys;

describe('Deserialization', function() {

  describe('Deck', function() {
    it('should deserialize', function() {
      var deck    = new Deck();
      var deckSte = JSON.parse( JSON.stringify(deck) );
      var deckIns = new Deck(deckSte);
      deckIns.should.be.an.instanceOf(Deck);
      deckIns.should.have.lengthOf(52);
      deckIns[0].should.be.an.instanceOf(Card);
      deckIns.should.eql(deck);
    });
  });

  describe('Tournament, Game and Round', function() {
    var tournament;
    var tournamentSte,
        tournamentIns;

    beforeEach(function() {
      tournament = new Tournament();
      tournament.registerPlayer(1, 'Sofia');
      tournament.registerPlayer(2, 'Bianca');
    });

    it('should deserialize when tournament has not started', function() {
      tournamentSte = JSON.parse( JSON.stringify(tournament) );
      tournamentIns = new Tournament(tournamentSte);
      tournamentIns.should.be.an.instanceOf(Tournament);
      tournamentIns.should.eql(tournament);
    });

    describe('Deserialization after tournament has started', function() {
      var omits;

      beforeEach(function() {
        tournament.start();
        tournamentSte = JSON.parse( JSON.stringify(tournament) );
        tournamentIns = new Tournament(tournamentSte);
      });

      it('should deserialize tournament', function() {
        tournamentIns.should.be.an.instanceOf(Tournament);

        omits = ['players', 'game', '_events'];
        _.omit(tournamentIns, omits).should.eql( _.omit(tournament, omits) );

        keys(tournament.players).forEach(function(position) {
          var playerIns     = tournamentIns.players[position],
              player        = tournament.players[position],
              playerDataIns = _.omit(playerIns, _.functions(playerIns)),
              playerData    = _.omit(player   , _.functions(player)),
              playerMtdsIns = _.functions(playerIns),
              playerMtds    = _.functions(player);

          // omit methods
          playerDataIns.should.eql(playerData);

          // methods
          playerMtdsIns.should.eql(playerMtds);
        });

      });

      it('should deserialize game', function() {
        tournamentIns.game.should.be.an.instanceOf(Game);

        omits = ['tournament', 'handsInfo', 'round', '_events'];
        _.omit(tournamentIns.game, omits).should.eql( _.omit(tournament.game, omits) );

        // handsInfo
        keys(tournament.game.handsInfo).forEach(function(position) {
          tournamentIns.game.handsInfo[position].hand[0].should.be.an.instanceOf(Card);
          tournamentIns.game.handsInfo[position].hand[1].should.be.an.instanceOf(Card);
          tournamentIns.game.handsInfo[position].should.eql( tournament.game.handsInfo[position] );
        });
        // Deck
        tournamentIns.game.deck.should.be.an.instanceOf(Deck);
      });

      it('should deserialize round', function() {
        tournamentIns.game.round.should.be.an.instanceOf(Round);

        omits = ['tournament', 'game', 'actionsInfo', '_events'];
        _.omit(tournamentIns.game.round, omits).should.eql( _.omit(tournament.game.round, omits) );
      });

    });

  });

});