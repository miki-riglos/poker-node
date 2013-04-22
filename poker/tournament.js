var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var Game       = require('./game').Game,
    Deck       = require('./deck').Deck,
    buttonDraw = require('./button-draw');

var keys = Object.keys;

// Tournament initial state
function getTournamentInitialState() {
  var tournamentInitialState = {
    options: {
      initialChips  : 10000,
      maximumPlayers: 10,
      initialBlinds : {small: 10, big: 25},
    },
    status     : 'open',  // 'open' || 'start' || 'end'
    button     : null,    // position of player (key of this.players)
    blinds     : {},      // running blinds
    players    : {},      // {position: {name: String, chips: Number} }
    gameCounter: 0,
    game       : null     // Game
  };
  tournamentInitialState.blinds.small = tournamentInitialState.options.initialBlinds.small;
  tournamentInitialState.blinds.big   = tournamentInitialState.options.initialBlinds.big;
  return tournamentInitialState;
}

// Tournament class
function Tournament(state) {
  _.extend(this, getTournamentInitialState());

  if (state) {
    _.extend(this, _.omit(state, ['status', 'game']));
    if (state.status === 'start') {
      this.start(state);
    }
  }

  events.EventEmitter.call(this);
}
util.inherits(Tournament, events.EventEmitter);

Tournament.prototype.registerPlayer = function(position, name) {
  //Don't overwrite position
  if (this.players[position]) {
    return {errorMessage: 'Position ' + position + ' already taken'};
  }
  //Validate position range
  if (position < 1 || position > this.options.maximumPlayers) {
    return {errorMessage: 'Invalid Position'};
  }

  //Don't allow registration after tournament starts (gameCounter > 0)
  if (this.gameCounter) {
    return {errorMessage: 'Tournament already started'};
  }

  this.players[position] = {
    name : name,
    chips: this.options.initialChips
  };
  return {errorMessage: ''};
};

Tournament.prototype.addActionsToPlayers = function() {
  // adding methods such as registeredPlayers[1].raises()
  var self = this;
  keys(this.players).forEach(function(position) {
    ['raise', 'call', 'check', 'fold'].forEach(function(method) {
      self.players[position][method + 's'] = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(+position);
        self.game.round[method].apply(self.game.round, args);
      };
    });
  });
};

Tournament.prototype.start = function(state) {
  if (this.status === 'open' &&  keys(this.players).length > 1) {
    this.status = 'start';
    this.addActionsToPlayers();

    this.emit('tournament-start', this);
    this.startGame(state);
  } else {
    this.emit('tournament-error', this);
  }
};

Tournament.prototype.setButton = function() {
  if (this.gameCounter === 1) {
    var draw = buttonDraw( this.getPositionsWithChips(), new Deck().shuffle() );
    this.button = draw.winner;
    this.emit('tournament-button', this, draw);
  } else {
    this.nextButton();
    this.emit('tournament-button', this);
  }
};

Tournament.prototype.nextButton = function() {
  var initialPosition = this.button,
      runningPosition = initialPosition,
      maximumPosition = Math.max.apply(Math, keys(this.players).map(function(key) { return +key; }));

  do {
    ++runningPosition;
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (this.players[runningPosition]) {
      if (this.players[runningPosition].chips > 0) {
        break;
      }
    }

  } while (runningPosition != initialPosition);

  this.button = runningPosition;
};

Tournament.prototype.getPositionsWithChips = function() {
  var positionsWithChips = [],
      position;

  for (position in this.players) {
    if (this.players[position].chips > 0) {
      positionsWithChips.push(position);
    }
  }

  return positionsWithChips;
};

Tournament.prototype.startGame = function(state) {
  var self = this,
      game;

  if (!state) {
    ++self.gameCounter;
    self.setButton();
    game = new Game(self);
  } else {
    // gameCounter and button already re-stated
    game = new Game(self, state.game);
  }

  self.game = game;

  game.on('start', function() {
    self.emit('game-start', self);
  });

  game.on('round-start', function() {
    self.emit('round-start', self);
  });

  game.on('round-next', function() {
    self.emit('round-next', self);
  });

  game.on('round-raise', function(evt) {
    self.players[evt.position].chips -= evt.amount;
    self.emit('round-raise', self, evt);
  });

  game.on('round-call', function(evt) {
    self.players[evt.position].chips -= evt.amount;
    self.emit('round-call', self, evt);
  });

  game.on('round-check', function(evt) {
    self.emit('round-check', self, evt);
  });

  game.on('round-fold', function(evt) {
    self.emit('round-fold', self, evt);
  });

  game.on('round-end', function() {
    self.emit('round-end', self);
  });

  game.on('end', function() {
    self.emit('game-end', self);
    if ( self.getPositionsWithChips().length > 1 ) {
      //Scheduling in next tick to avoid recursive stacking
      process.nextTick(function() { self.startGame(); });
    } else {
      self.end();
    }
  });

  if (!state) {
    game.start();
  } else {
    game.start(state.game);
  }
};

Tournament.prototype.end = function() {
  this.status = 'end';
  this.emit('tournament-end', this);
};

Tournament.prototype.toJSON = function() {
  return _.omit(this, ['_events']);
};

// Exports
module.exports = {
  Tournament: Tournament
};

