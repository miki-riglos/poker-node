var util   = require("util"),
    events = require("events"),
    _      = require("underscore");

var Player = require("./player").Player,
    Game   = require("./game").Game;

var defaultOptions = {
  initialChips  : 10000,
  maximumPlayers: 10
};

// Tournament class
function Tournament(options) {
  this.options = _.extend({}, defaultOptions, options);
  this.players = {};
  this.gameCounter = 0;
  events.EventEmitter.call(this);
}
util.inherits(Tournament, events.EventEmitter);

Tournament.prototype.registerPlayer = function(position, name) {
  //Don't overwrite position
  if (this.players[position]) {
    throw new Error("Position " + position + " already taken");
  }
  //Validate position range
  if (position < 1 || position > this.options.maximumPlayers) {
    throw new Error("Invalid Position");
  }
  
  //Don't allow registration after tournament starts (gameCounter > 0)
  if (this.gameCounter) {
    throw new Error("Tournament already started");
  }
  this.players[position] = new Player(name, this.options.initialChips);
  
  if ( Object.keys( this.players ).length === this.options.maximumPlayers ) {
    this.start();
  }
};
  
Tournament.prototype.getActivePlayers = function() {
  var self = this,
      activePlayers = {};

  Object.keys( this.players ).forEach(function(pos) {
    if (self.players[pos].chips > 0) {
      activePlayers[pos] = self.players[pos];
    }
  });
  
  return activePlayers;
};

Tournament.prototype.start = function() {
  this.emit("tournament-start");
  this.startGame();
};

Tournament.prototype.end = function() {
  this.emit("tournament-end");
};
  
Tournament.prototype.startGame = function() {
  var self = this,
      game = new Game( self.getActivePlayers() );
  
  self.currentGame = game;

  game.on("start", function() {
    self.gameCounter++;
    self.emit("game-start");
  });

  game.on("end", function() {
    self.emit("game-end");
    if (Object.keys( self.getActivePlayers() ).length > 1) {
      self.startGame();
    } else {
      game = null;
      self.end();
    }
  });
  
  game.start();
};


// Exports
module.exports = {
  Tournament: Tournament
};
