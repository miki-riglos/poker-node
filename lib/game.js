var util   = require("util"),
    events = require("events");

// Game class
function Game(players) {
  this.players = players;
  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

Game.prototype.start = function() {
  this.emit("start");
};

Game.prototype.end = function() {
  this.emit("end");
};


// Exports
module.exports = {
  Game: Game
};
