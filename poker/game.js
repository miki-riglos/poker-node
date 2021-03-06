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
    handsInfo   : {},     // {position: {hand: Card[], folded: Boolean, totalBet: Number}}
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
function Game(table, state) {
  this.table = table;

  _.extend(this, getGameInitialState());

  if (!state) {
    this.number    = this.table.gameCounter;
    this.handsInfo = getHandsInfo( this.table.getPositionsWithChips() );
    this.deck      = new Deck().shuffle();
  } else {
    _.extend(this, _.omit(state, ['handsInfo', 'deck', 'flop', 'turn', 'river', 'burnt', 'round']));
    keys(state.handsInfo).forEach(function(position) {
      this.handsInfo[position] = {
        hand    : state.handsInfo[position].hand.map(function(stateCard) { return new Card(stateCard) }),
        folded  : state.handsInfo[position].folded,
        totalBet: state.handsInfo[position].totalBet
      };
    }, this);
    this.deck = new Deck(state.deck);
    this.flop = state.flop.map(function(stateFlopCard) { return new Card(stateFlopCard) });
    if (keys(state.turn).length)  this.turn  = new Card(state.turn);
    if (keys(state.river).length) this.river = new Card(state.river);
    this.burnt = state.burnt.map(function(stateBurntCard) { return new Card(stateBurntCard) });
    // round re-stated by Table.start()
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

  for (position in this.handsInfo) {
    if (!this.handsInfo[position].folded) {
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

  round.on('next', function() {
    self.emit('round-next');
  });

  round.on('raise', function(evt) {
    self.pot += evt.amount;
    self.handsInfo[evt.position].totalBet += evt.amount;

    self.emit('round-raise', evt);
  });

  round.on('call', function(evt) {
    self.pot += evt.amount;
    self.handsInfo[evt.position].totalBet += evt.amount;

    self.emit('round-call', evt);
  });

  round.on('check', function(evt) {
    self.emit('round-check', evt);
  });

  round.on('fold', function(evt) {
    self.handsInfo[evt.position].folded = true;

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
        self.table.players[winnerPosition].chips += self.pot / positionsActing.length;
      });
      self.end();
    }
  });

  // No need to start round with state,
  // new Game() and new Round() re-state everything
  if (!state) {
    self.dealCards[self.roundCounter](self);
    round.start();
  }
};

Game.prototype.dealCards = {
  1: function preflop(self) {
      var positions = keys(self.handsInfo).sort(function(left, right) { return left - right; });

      self.burnt.push( self.deck.deal() );

      [1, 2].forEach(function() {
        positions.forEach(function(position) {
          self.handsInfo[position].hand.push( self.deck.deal() );
        });
      });
    },
  2: function flop(self) {
      self.burnt.push( self.deck.deal() );
      self.flop = [1, 2, 3].map(function() {
        return self.deck.deal();
      });
    },
  3: function turn(self) {
      self.burnt.push( self.deck.deal() );
      self.turn = self.deck.deal();
    },
  4: function river(self) {
      self.burnt.push( self.deck.deal() );
      self.river = self.deck.deal();
    }
},

Game.prototype.end = function() {
  this.emit('end');
};

Game.prototype.toJSON = function() {
  return _.omit(this, ['table', 'dealCards', '_events']);
};

// Private
function getHandsInfo(positionsWithChips) {
  var handsInfo = {};

  positionsWithChips.forEach(function(position) {
    handsInfo[position] = {
      hand    : [],
      folded  : false,
      totalBet: 0
    };
  });

  return handsInfo;
}


// Exports
module.exports = {
  Game: Game
};
