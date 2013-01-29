var util   = require("util"),
    events = require("events");

// Round class
function Round(roundCounter, button, blinds, registeredPlayers, gamePlayers, positionsActing) {
  this.number = roundCounter;   // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'
  this.button = button;
  this.blinds = blinds;
  this.registeredPlayers = registeredPlayers;                 // {position: {name: String, chips: Number} }
  this.gamePlayers       = gamePlayers;                       // {position: {hand: Card[], folded: Boolean, totalBet: Number} }
  this.roundPlayers      = getRoundPlayers(positionsActing);  // {position: {actions: String[], bets: Number[]} }
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
  if (this.number === 1) {
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
      maximumPosition = Math.max.apply(Math, Object.keys(this.roundPlayers).map(function(key) { return +key } )),
      found = false;

  while (runningPosition != initialPosition && !found) {
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (this.roundPlayers[runningPosition]) {
      if (!this.gamePlayers[runningPosition].folded && this.registeredPlayers[runningPosition].chips > 0) {
        found = true;
      }
    }

    ++runningPosition;
  }

  this.positionToAct = runningPosition - 1;

  if (this.positionToAct === initialPosition) {
    this.end();
  }
};

Round.prototype.raise = function(position, amount, type) {
  if (this.betToCall && amount <= this.betToCall) {
    //TODO: emit error
    return;
  }
  //TODO: validate amount > player.chips
  type = type || "regular";
  this.finalPosition = position;
  this.betToCall     = amount;

  // Round player data
  this.roundPlayers[position].actions.push( "raise" + (type === "regular" ? "" : "-" + type) );
  this.roundPlayers[position].bets.push(amount);

  // Handler updates game and tournament data
  this.emit("raise", {position: position, amount: amount, type: type});
};

Round.prototype.end = function() {
  this.emit("end");
};

// Private
function getRoundPlayers(activePositions) {
  var roundPlayers = {};

  activePositions.forEach(function(position) {
    roundPlayers[position] = {
      actions: [],
      bets   : []
    };
  });

  return roundPlayers;
}


// Exports
module.exports = {
  Round: Round
};
