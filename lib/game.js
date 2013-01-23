var util   = require("util"),
    events = require("events");

var Round = require("./round").Round;

// Game class
function Game(activePlayers /* [{position: Number, player: Player}]  */, gameCounter ) {
  this.number = gameCounter;
  this.players = activePlayers.map(function(activePlayer) {
    return {
      position: activePlayer.position,
      player  : activePlayer.player,
      hand    : [],
      folded  : false,
      totalBet: 0
    };
  });
  this.roundCounter = 0;

  events.EventEmitter.call(this);
}
util.inherits(Game, events.EventEmitter);

// Returns acting players, haven't folded [{position: Number, player: Player, actions: String[], bets: Number[]}]
Game.prototype.getActingPlayers = function() {
  var actingPlayers = [];

  this.players.forEach(function(gamePlayer) {
    if (!gamePlayer.folded) {
      actingPlayers.push({
        position: gamePlayer.position,
        player  : gamePlayer.player,
        actions : [],
        bets    : []
      });
    }
  });

  return actingPlayers;
};

Game.prototype.start = function() {
  this.emit("start");
};

Game.prototype.end = function() {
  this.emit("end");
};

Game.prototype.startRound = function() {
  var self  = this,
      round = new Round( self.getActingPlayers(), self.roundCounter++ );

  self.currentRound = round;

  round.on("start", function() {
    self.emit("round-start");
  });

  round.on("end", function() {
    self.emit("round-end");
    if ( self.getActingPlayers().length > 1 && self.roundCounter < 4 ) {
      //Scheduling in next tick to avoid recursive stacking
      process.nextTick(function() { self.startRound(); });
    } else {
      self.end();
    }
  });

  round.start();
};


// Exports
module.exports = {
  Game: Game
};
