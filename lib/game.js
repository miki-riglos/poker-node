var util   = require("util"),
    events = require("events"),
    _      = require("underscore");


var Deck  = require("./deck").Deck,
    Round = require("./round").Round;

// Game class
function Game(gameCounter, button, blinds, registeredPlayers, positionsWithChips) {
  this.number = gameCounter;
  this.button = button;
  this.blinds = blinds;
  this.registeredPlayers = registeredPlayers;                   // {position: {name: String, chips: Number} }
  this.gamePlayers       = getGamePlayers(positionsWithChips);  // {position: {hand: Card[], folded: Boolean, totalBet: Number} }
  this.pot    = 0;
  this.deck   = new Deck().shuffle();
  this.flop   = [];
  this.turn   = {};
  this.river  = {};
  this.burnt  = [];

  this.winners = [];

  this.roundCounter = 0;

  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
  this.emit("start");

  this.startRound();
};

Game.prototype.getPositionsActing = function() {
  var positionsActing = [],
      position;

  for (position in this.gamePlayers) {
    if (!this.gamePlayers[position].folded) {
      positionsActing.push(position);
    }
  }

  return positionsActing;
};

Game.prototype.startRound = function() {
  var self  = this,
      round = new Round( ++self.roundCounter, self.button, self.blinds, self.registeredPlayers, self.gamePlayers, self.getPositionsActing() );

  self.currentRound = round;

  round.on("start", function() {
    self.emit("round-start");
  });

  round.on("raise", function(evt) {
    self.pot += evt.amount;
    self.gamePlayers[evt.position].totalBet += evt.amount;

    self.emit("round-raise", evt);
  });

  round.on("call", function(evt) {
    self.pot += evt.amount;
    self.gamePlayers[evt.position].totalBet += evt.amount;

    self.emit("round-call", evt);
  });

  round.on("check", function(evt) {
    self.emit("round-check", evt);
  });

  round.on("fold", function(evt) {
    self.gamePlayers[evt.position].folded = true;

    self.emit("round-fold", evt);
  });

  round.on("end", function() {
    self.emit("round-end");
    if ( _.size(self.getPositionsActing()) > 1 && self.roundCounter < 4 ) {
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
      var positions = Object.keys(self.gamePlayers).sort(function(left, right) { return left - right; });

      self.burnt.push( self.deck.deal() );

      [1, 2].forEach(function() {
        positions.forEach(function(position) {
          self.gamePlayers[position].hand.push( self.deck.deal() );
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

// Private
function getGamePlayers(positionsWithChips) {
  var gamePlayers = {};

  positionsWithChips.forEach(function(position) {
    gamePlayers[position] = {
      hand    : [],
      folded  : false,
      totalBet: 0
    };
  });

  return gamePlayers;
}


// Exports
module.exports = {
  Game: Game
};
