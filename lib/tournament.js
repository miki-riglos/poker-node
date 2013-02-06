var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var Player = require('./player').Player,
    Game   = require('./game').Game;

var defaultOptions = {
  initialChips  : 10000,
  maximumPlayers: 10,
  initialSmallBlind: 10,
  initialBigBlind: 25
};

// Tournament class
function Tournament(options) {
  this.options = _.extend({}, defaultOptions, options);
  this.status = 'open';
  this.button = null;
  this.blinds = {
    small: this.options.initialSmallBlind,
    big  : this.options.initialBigBlind
  };
  this.registeredPlayers = {};
  this.gameCounter = 0;
  this.currentGame = null;

  events.EventEmitter.call(this);
}
util.inherits(Tournament, events.EventEmitter);

Tournament.prototype.registerPlayer = function(position, name) {
  //TODO: Validate position is number

  //Don't overwrite position
  if (this.registeredPlayers[position]) {
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

  this.registeredPlayers[position] = new Player(name, this.options.initialChips);
  return {errorMessage: ''};
};

Tournament.prototype.start = function() {
  if (this.status === 'open' &&  _.size(this.registeredPlayers) > 1) {
    this.status = 'start';
    this.emit('tournament-start', this);
    this.startGame();
  } else {
    this.emit('tournament-error', this);
  }
};

Tournament.prototype.setButton = function() {
  if (this.gameCounter === 1) {
    this.button = 1;  //TODO: deal cards to define first button, pass data to the event handler
  } else {
    this.nextButton();
  }
  this.emit('tournament-button', this);
};

Tournament.prototype.nextButton = function() {
  var initialPosition = this.button,
      runningPosition = initialPosition,
      maximumPosition = Math.max.apply(Math, Object.keys(this.registeredPlayers).map(function(key) { return +key; }));

  do {
    ++runningPosition;
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (this.registeredPlayers[runningPosition]) {
      if (this.registeredPlayers[runningPosition].chips > 0) {
        break;
      }
    }

  } while (runningPosition != initialPosition);

  this.button = runningPosition;
};

Tournament.prototype.getPositionsWithChips = function() {
  var positionsWithChips = [],
      position;

  for (position in this.registeredPlayers) {
    if (this.registeredPlayers[position].chips > 0) {
      positionsWithChips.push(position);
    }
  }

  return positionsWithChips;
};

Tournament.prototype.startGame = function() {
  var self = this,
      game;

  ++self.gameCounter;
  self.setButton();

  game = new Game(self.gameCounter, self.button, self.blinds, self.registeredPlayers, self.getPositionsWithChips());
  self.currentGame = game;

  game.on('start', function() {
    self.emit('game-start', self);
  });

  game.on('round-start', function() {
    self.emit('round-start', self);
  });

  game.on('round-raise', function(evt) {
    self.registeredPlayers[evt.position].chips -= evt.amount;
    self.emit('round-raise', self, evt);
  });

  game.on('round-call', function(evt) {
    self.registeredPlayers[evt.position].chips -= evt.amount;
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

  game.start();
};

Tournament.prototype.end = function() {
  this.emit('tournament-end', this);
};


// Exports
module.exports = {
  Tournament: Tournament
};
