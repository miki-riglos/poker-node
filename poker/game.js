var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var Deck  = require('./deck').Deck,
    Round = require('./round').Round;

var keys = Object.keys;

// Game initial state
function getGameInitialState() {
  var gameInitialState = {
    number      : 0,
    gamePlayers : {},     // {position: {hand: Card[], folded: Boolean, totalBet: Number} }
    pot         : 0,
    deck        : [],     // Card[]
    flop        : [],     // Card
    turn        : {},     // Card
    river       : {},     // Card
    burnt       : [],     // Card[]
    winners     : [],     // Number[]
    roundCounter: 0,
    round       : null    // Round
  };
  return gameInitialState;
}

// Game class
function Game(tournament, state) {
  state = state || getGameInitialState();
  _.extend(this, state);

  this.tournament = tournament;

  if (!this.number) {
    this.number      = this.tournament.gameCounter;
    this.gamePlayers = getGamePlayers(this.tournament.getPositionsWithChips());
    this.deck        = new Deck().shuffle();
  }
  //TODO: if state.round, instanciate current round

  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
  this.emit('start');

  this.startRound();
};

Game.prototype.getPositionsActing = function() {
  var positionsActing = [],
      position;

  for (position in this.gamePlayers) {
    if (!this.gamePlayers[position].folded) {
      positionsActing.push(+position);
    }
  }

  return positionsActing;
};

Game.prototype.startRound = function() {
  var self = this,
      round;

  ++self.roundCounter;

  round = new Round(self);
  self.round = round;

  round.on('start', function() {
    self.emit('round-start');
  });

  round.on('raise', function(evt) {
    self.pot += evt.amount;
    self.gamePlayers[evt.position].totalBet += evt.amount;

    self.emit('round-raise', evt);
  });

  round.on('call', function(evt) {
    self.pot += evt.amount;
    self.gamePlayers[evt.position].totalBet += evt.amount;

    self.emit('round-call', evt);
  });

  round.on('check', function(evt) {
    self.emit('round-check', evt);
  });

  round.on('fold', function(evt) {
    self.gamePlayers[evt.position].folded = true;

    self.emit('round-fold', evt);
  });

  round.on('end', function() {
    self.emit('round-end');
    var positionsActing = self.getPositionsActing();
    if ( positionsActing.length > 1 && self.roundCounter < 4 ) {
      // Scheduling in next tick to avoid recursive stacking
      process.nextTick(function() { self.startRound(); });
    } else {
      // Set winner(s)
      self.winners = positionsActing;
      // Pot distribution
      self.winners.forEach(function(winnerPosition) {
        self.registeredPlayers[winnerPosition].chips += self.pot / positionsActing.length;
      });
      self.end();
    }
  });

  self.dealCards[self.roundCounter](self);

  round.start();
};

Game.prototype.dealCards = {
  1: function preflop(self) {
      var positions = keys(self.gamePlayers).sort(function(left, right) { return left - right; });

      self.burnt.push( self.deck.deal() );

      [1, 2].forEach(function() {
        positions.forEach(function(position) {
          self.gamePlayers[position].hand.push( self.deck.deal() );
        });
      });
    },
  2: function flop(self) {
      self.flop = [1, 2, 3].map(function() {
        return self.deck.deal();
      });
    },
  3: function turn(self) {
      self.turn = self.deck.deal();
    },
  4: function river(self) {
      self.river = self.deck.deal();
    }
},

Game.prototype.end = function() {
  this.emit('end');
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
