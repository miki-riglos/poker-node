var util   = require("util"),
    events = require("events");

var Deck  = require("./deck").Deck,
    Round = require("./round").Round;

// Game class
function Game(gameCounter, button, blinds, gamePlayers) {
  this.number  = gameCounter;
  this.button  = button;
  this.blinds  = blinds;
  this.players = gamePlayers; // {position: {player: Player, hand: Card[], folded: Boolean, totalBet: Number} }
  this.pot     = 0;
  this.deck    = new Deck().shuffle();
  this.flop    = [];
  this.turn    = {};
  this.river   = {};
  this.burnt   = [];

  this.roundCounter = 0;

  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
  this.emit("start");

  this.startRound();
};

// Returns acting players, haven't folded {position: {gamePlayer: GamePlayer, actions: String[], bets: Number[]} }
Game.prototype.getRoundPlayers = function() {
  var roundPlayers = {},
      posKey;

  for (posKey in this.players) {
    if (!this.players[posKey].folded) {
      roundPlayers[posKey] = {
        gamePlayer: this.players[posKey],
        actions   : [],
        bets      : []
      };
    }
  }

  return roundPlayers;
};

Game.prototype.startRound = function() {
  var self  = this,
      round = new Round( ++self.roundCounter, self.button, self.blinds, self.getRoundPlayers() );

  self.currentRound = round;

  round.on("start", function() {
    self.emit("round-start");
  });

  round.on("end", function() {
    self.emit("round-end");
    if ( self.getActingPlayers().length > 1 && self.roundCounter < 4 ) {
      //Scheduling in next tick to avoid recursive stacking
      process.nextTick(function() { self.startRound(); });
    } else {
      self.end();
    }
  });

  self.dealCards[self.roundCounter](self);
  round.start();
};

Game.prototype.dealCards = {
  1: function preflop(self) {
      var positions = Object.keys(self.players).sort(function(left, right) { return left - right});

      self.burnt.push( self.deck.deal() );

      [1, 2].forEach(function() {
        positions.forEach(function(position) {
          self.players[position].hand.push( self.deck.deal() );
        });
      });
    },
  2: function flop(self) {

    },
  3: function turn(self) {

    },
  4: function river(self) {

    }
},

Game.prototype.end = function() {
  this.emit("end");
};


// Exports
module.exports = {
  Game: Game
};
