var util   = require("util"),
    events = require("events");

// Round class
function Round(actingPlayers /* [{position: Number, player: Player, actions: String[], bets: Number[]}] */, roundCounter) {
  this.number = roundCounter;   // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'
  this.players = actingPlayers.map(function(actingPlayer) {
    return {
      position: actingPlayer.position,
      player  : actingPlayer.player,
      actions : [],
      bets    : []
    };
  });

  events.EventEmitter.call(this);
}
util.inherits(Round, events.EventEmitter);

Round.prototype.start = function() {
  this.emit("start");
};

Round.prototype.end = function() {
  this.emit("end");
};


// Exports
module.exports = {
  Round: Round
};
