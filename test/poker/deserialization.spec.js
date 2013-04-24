/*global describe, it, before, beforeEach, afterEach, after*/
var _ = require('underscore');

var Table = require('../../poker/table').Table,
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

  describe('Table, Game and Round', function() {
    var table;
    var tableSte,
        tableIns;

    beforeEach(function() {
      table = new Table();
      table.registerPlayer(1, 'Sofia');
      table.registerPlayer(2, 'Bianca');
    });

    it('should deserialize when table has not started', function() {
      tableSte = JSON.parse( JSON.stringify(table) );
      tableIns = new Table(tableSte);
      tableIns.should.be.an.instanceOf(Table);
      tableIns.should.eql(table);
    });

    describe('Deserialization after table has started', function() {
      var omits;

      beforeEach(function() {
        table.start();
        tableSte = JSON.parse( JSON.stringify(table) );
        tableIns = new Table(tableSte);
      });

      it('should deserialize table', function() {
        tableIns.should.be.an.instanceOf(Table);

        omits = ['players', 'game', '_events'];
        _.omit(tableIns, omits).should.eql( _.omit(table, omits) );

        keys(table.players).forEach(function(position) {
          var playerIns     = tableIns.players[position],
              player        = table.players[position],
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
        tableIns.game.should.be.an.instanceOf(Game);

        omits = ['table', 'handsInfo', 'round', '_events'];
        _.omit(tableIns.game, omits).should.eql( _.omit(table.game, omits) );

        // handsInfo
        keys(table.game.handsInfo).forEach(function(position) {
          tableIns.game.handsInfo[position].hand[0].should.be.an.instanceOf(Card);
          tableIns.game.handsInfo[position].hand[1].should.be.an.instanceOf(Card);
          tableIns.game.handsInfo[position].should.eql( table.game.handsInfo[position] );
        });
        // Deck
        tableIns.game.deck.should.be.an.instanceOf(Deck);
      });

      it('should deserialize round', function() {
        tableIns.game.round.should.be.an.instanceOf(Round);

        omits = ['table', 'game', 'actionsInfo', '_events'];
        _.omit(tableIns.game.round, omits).should.eql( _.omit(table.game.round, omits) );
      });

    });

  });

});