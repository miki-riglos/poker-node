// Tournament class
var _      = require("underscore"),
    Player = require("./players").Player;

var defaultOptions = {
  initialChips: 10000,
  maximumPlayers: 10
};

function Tournament(options) {
  this.options = _.extend(defaultOptions, options);
  this.registeredPlayers = {};
  this.gameCounter = 0;
}

Tournament.prototype = {
  registerPlayer: function(position, name) {
    //Don't overwrite position
    if (this.registeredPlayers[position]) {
      throw new Error("Position " + position + " already taken");
    }
    //Validate position range
    if (position < 1 || position > this.options.maximumPlayers) {
      throw new Error("Invalid Position");
    }
    
    //Don't allow registration after tournament starts (gameCounter > 0)
    if (this.gameCounter) {
      throw new Error("Tournamente already started");
    }
    this.registeredPlayers[position] = new Player(name, this.options.initialChips);
  },
  
  start: function() {
    this.gameCounter++;
  }
};

// Exports
module.exports = {
  Tournament: Tournament
};
