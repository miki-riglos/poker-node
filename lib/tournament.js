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
  this.registeredPlayers = {};
  this.gameCounter = 0;
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
  if ( _.size(this.registeredPlayers) ) {
    this.emit("tournament-start");
    this.startGame();
  } else {
    this.emit("tournament-error");
  }
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
    if ( self.getActivePlayers().length > 1 ) {
      self.startGame();
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
