var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var Player     = require('./player').Player,
    Game       = require('./game').Game,
    Deck       = require('./deck').Deck,
    buttonDraw = require('./button-draw');

var defaultOptions = {
  initialChips     : 10000,
  maximumPlayers   : 10,
  initialSmallBlind: 10,
  initialBigBlind  : 25
};

// Tournament class
function Tournament(options, init) {
  if (!(this instanceof Tournament)) return new Tournament(options, init);
  if (!init) {
    this.options = _.extend({}, defaultOptions, options);
    this.status  = 'open';
    this.button  = null;
    this.blinds  = {
      small: this.options.initialSmallBlind,
      big  : this.options.initialBigBlind
    };
    this.registeredPlayers = {};
    this.gameCounter       = 0;
    this.currentGame       = null;
  } else {
    this.options = options;
    this.status  = init.status;
    this.button  = init.button;
    this.blinds  = init.blinds;
    this.registeredPlayers = {};
    Object.keys(init.registeredPlayers).forEach(function(position) {
      this.registeredPlayers[position] = Player(init.registeredPlayers[position]);
    }, this);
    this.gameCounter = init.gameCounter;
    if (init.currentGame === null) {
      this.currentGame = null;
    } else {
      this.currentGame = Game(this.gameCounter, this.button, this.blinds, this.registeredPlayers, this.getPositionsWithChips(), init.currentGame);
      this.addActionsToPlayers();
    }
  }
  events.EventEmitter.call(this);
}
util.inherits(Tournament, events.EventEmitter);

Tournament.prototype.registerPlayer = function(position, name) {
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

  this.registeredPlayers[position] = Player(name, this.options.initialChips);
  return {errorMessage: ''};
};

Tournament.prototype.addActionsToPlayers = function() {
  // adding methods such as registeredPlayers[1].raises()
  var self = this;
  Object.keys(this.registeredPlayers).forEach(function(position) {
    ['raise', 'call', 'check', 'fold'].forEach(function(method) {
      self.registeredPlayers[position][method + 's'] = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(+position);
        self.currentGame.currentRound[method].apply(self.currentGame.currentRound, args);
      };
    });
  });
};

Tournament.prototype.start = function() {
  if (this.status === 'open' &&  _.size(this.registeredPlayers) > 1) {
    this.status = 'start';
    this.addActionsToPlayers();

    this.emit('tournament-start', this);
    this.startGame();
  } else {
    this.emit('tournament-error', this);
  }
};

Tournament.prototype.setButton = function() {
  if (this.gameCounter === 1) {
    var draw = buttonDraw( this.getPositionsWithChips(), Deck().shuffle() );
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

  game = Game(self.gameCounter, self.button, self.blinds, self.registeredPlayers, self.getPositionsWithChips());
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
