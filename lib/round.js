var util   = require("util"),
    events = require("events");

// Round class
function Round(roundCounter, button, blinds, roundPlayers) {
  this.number = roundCounter;   // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'
  this.button = button;
  this.blinds = blinds;
  this.players = roundPlayers; // {position: {gamePlayer: GamePlayer, actions: String[], bets: Number[]} }
  this.positionToAct = null;
  this.finalPosition = null;
  this.betToCall     = null;

  events.EventEmitter.call(this);
}
util.inherits(Round, events.EventEmitter);

Round.prototype.start = function() {
  this.positionToAct = this.button;
  this.nextPosition();
  this.finalPosition = this.positionToAct;

  this.emit("start");

  // If preflop place blinds
  if (this.number == 1) {
    // small blind
    this.raise(this.positionToAct, this.blinds.small, "sb");
    this.nextPosition();
    // big blind
    this.raise(this.positionToAct, this.blinds.big, "bb");
    this.nextPosition();
  }

};

Round.prototype.nextPosition = function() {
  var initialPosition = this.positionToAct,
      runningPosition = this.positionToAct + 1,
      maximumPosition = Math.max.apply(Math, Object.keys(this.players).map(function(key) { return +key } )),
      found = false;

  while (runningPosition != initialPosition && !found) {
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (this.players[runningPosition]) {
      if (!this.players[runningPosition].gamePlayer.folded && this.players[runningPosition].gamePlayer.player.chips > 0) {
        found = true;
      }
    }

    ++runningPosition;
  }

  this.positionToAct = runningPosition - 1;

  if (this.positionToAct == initialPosition) {
    this.end();
  }
};

Round.prototype.raise = function(position, amount, type) {
  if (this.betToCall && amount <= this.betToCall) {
    //TODO: emit error
    return;
  }
  //TODO: validate amount > player.chips
  var suffix = type ? ("-" + type) : "";
  this.finalPosition = position;
  this.betToCall     = amount;

  // Round player data
  this.players[position].actions.push("raise" + suffix);
  this.players[position].bets.push(amount);
  // Game player data
  this.players[position].gamePlayer.totalBet += amount;
  // Tournament player data
  this.players[position].gamePlayer.player.chips -= amount;
  //TODO: update game pot

  this.emit("raise" + suffix);
};

Round.prototype.end = function() {
  this.emit("end");
};


// Exports
module.exports = {
  Round: Round
};
