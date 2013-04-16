var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var Deck  = require('./deck').Deck,
    Card  = require('./deck').Card,
    Round = require('./round').Round;

var keys = Object.keys;

// Game initial state
function getGameInitialState() {
  var gameInitialState = {
    number      : 0,
    gamePlayers : {},     // {position: {hand: Card[], folded: Boolean, totalBet: Number} }
    pot         : 0,
    deck        : [],     // Deck, Card[]
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
  this.tournament = tournament;

  _.extend(this, getGameInitialState());

  if (!state) {
    this.number      = this.tournament.gameCounter;
    this.gamePlayers = getGamePlayers( this.tournament.getPositionsWithChips() );
    this.deck        = new Deck().shuffle();
  } else {
    _.extend(this, _.omit(state, ['deck', 'flop', 'turn', 'river', 'burnt', 'round']));
    this.deck = new Deck(state.deck);
    this.flop = state.flop.map(function(stateFlopCard) { return new Card(stateFlopCard) });
    if (keys(state.turn).length)  this.turn  = new Card(state.turn);
    if (keys(state.river).length) this.river = new Card(state.river);
    this.burnt = state.burnt.map(function(stateBurntCard) { return new Card(stateBurntCard) });
    // round re-stated by Tournament.start()
  }

  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function(state) {
  this.emit('start');

  this.startRound(state);
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

Game.prototype.startRound = function(state) {
  var self = this,
      round;

  if (!state) {
    ++self.roundCounter;
    round = new Round(self);
  } else {
    // roundCounter already re-stated
    round = new Round(self, state.round);
  }

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

  // No need to start round with state, new Round() is re-states everything
  if (!state) {
    round.start();
  }
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

Game.prototype.toJSON = function() {
  return _.omit(this, ['tournament', 'dealCards', '_events']);
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
