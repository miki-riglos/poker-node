var util   = require("util"),
    events = require("events"),
    _      = require("underscore");

var Player = require("./player").Player,
    Game   = require("./game").Game;

var defaultOptions = {
  initialChips  : 10000,
  maximumPlayers: 10,
  initialSmallBlind: 10,
  initialBigBlind: 25
};

// Tournament class
function Tournament(options) {
  this.options = _.extend({}, defaultOptions, options);
  this.status = "open";
  this.registeredPlayers = {};
  this.gameCounter = 0;
  this.button = null;
  this.blinds = {
    small: this.options.initialSmallBlind,
    big  : this.options.initialBigBlind
  };

  events.EventEmitter.call(this);
}
util.inherits(Tournament, events.EventEmitter);

Tournament.prototype.registerPlayer = function(position, name) {
  //Don't overwrite position
  if (this.registeredPlayers[position]) {
    return {errorMessage: "Position " + position + " already taken"};
  }
  //Validate position range
  if (position < 1 || position > this.options.maximumPlayers) {
    return {errorMessage: "Invalid Position"};
  }

  //Don't allow registration after tournament starts (gameCounter > 0)
  if (this.gameCounter) {
    return {errorMessage: "Tournament already started"};
  }

  this.registeredPlayers[position] = new Player(name, this.options.initialChips);
  return {errorMessage: ""};
};

// Returns players with chips [{position: Number, player: Player}]
Tournament.prototype.getActivePlayers = function() {
  var self = this,
      activePlayers = [];

  Object.keys( this.registeredPlayers ).forEach(function(posKey) {
    if (self.registeredPlayers[posKey].chips > 0) {
      activePlayers.push({
        position: +posKey,
        player: self.registeredPlayers[posKey]
      });
    }
  });

  //Make sure is sorted by Position
  activePlayers = activePlayers.sort(function(left, right) {
    return left.position - right.position;
  });

  return activePlayers;
};

Tournament.prototype.start = function() {
  if (this.status == "open" &&  _.size(this.registeredPlayers) > 1) {
    this.status = "start";
    this.emit("tournament-start");
    this.setFirstButton();
    this.startGame();
  } else {
    this.emit("tournament-error");
  }
};

Tournament.prototype.setFirstButton = function() {
  this.button = 1;  //TODO: deal cards to define first button, pass data to the event handler
  this.emit("tournament-first-button");
};

Tournament.prototype.end = function() {
  this.emit("tournament-end");
};

Tournament.prototype.startGame = function() {
  var self = this,
      game = new Game( self.getActivePlayers(), self.gameCounter++ );

  self.currentGame = game;

  game.on("start", function() {
    self.emit("game-start");
  });

  game.on("end", function() {
    self.emit("game-end");
    if ( self.getActivePlayers().length > 1 ) {
      //Scheduling in next tick to avoid recursive stacking
      process.nextTick(function() { self.startGame(); });
    } else {
      self.end();
    }
  });

  game.start();
};


// Exports
module.exports = {
  Tournament: Tournament
};
