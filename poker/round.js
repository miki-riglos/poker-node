var util   = require('util'),
    events = require('events');

// Round class
function Round(roundCounter, button, blinds, registeredPlayers, gamePlayers, positionsActing, init) {
  if (!(this instanceof Round)) return new Round(roundCounter, button, blinds, registeredPlayers, gamePlayers, positionsActing);
  this.number = roundCounter;   // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'
  this.button = button;
  this.blinds = blinds;
  this.registeredPlayers = registeredPlayers;                 // {position: {name: String, chips: Number} }
  this.gamePlayers       = gamePlayers;                       // {position: {hand: Card[], folded: Boolean, totalBet: Number} }
  this.roundPlayers      = getRoundPlayers(positionsActing);  // {position: {actions: String[], bets: Number[]} }
  if (!init) {
    this.positionToAct = null;
    this.finalPosition = null;
    this.betToCall     = null;
  } else {
    this.positionToAct = init.positionToAct;
    this.finalPosition = init.finalPosition;
    this.betToCall     = init.betToCall;
  }

  events.EventEmitter.call(this);
}
util.inherits(Round, events.EventEmitter);

Round.prototype.start = function() {
  this.positionToAct = this.button;
  this.nextPosition();
  this.finalPosition = this.positionToAct;
  this.betToCall     = 0;

  this.emit('start');

  // If preflop place blinds
  if (this.number === 1) {
    // small blind
    this.raise(this.positionToAct, this.blinds.small, 'sb');
    // big blind
    this.raise(this.positionToAct, this.blinds.big, 'bb');
  }

};

Round.prototype.nextPosition = function() {
  var initialPosition = this.positionToAct,
      runningPosition = initialPosition,
      maximumPosition = Math.max.apply(Math, Object.keys(this.roundPlayers).map(function(key) { return +key; }));

  do {
    ++runningPosition;
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (this.roundPlayers[runningPosition]) {
      if (!this.gamePlayers[runningPosition].folded && this.registeredPlayers[runningPosition].chips > 0) {
        break;
      }
    }

    if (runningPosition === this.finalPosition) break;

  } while (runningPosition != initialPosition);

  this.positionToAct = runningPosition;

  if (this.positionToAct === this.finalPosition) {
    this.end();
  }
};

Round.prototype.raise = function(position, amount, type) {
  if (this.positionToAct !== position) {
    //TODO: emit error
    return;
  }
  //TODO: validate amount <= player.chips
  if (this.betToCall && amount <= this.betToCall) {   //TODO: what if is ALL-IN?
    //TODO: emit error
    return;
  }
  type = type || 'regular';
  this.finalPosition = position;
  this.betToCall     = amount;

  // Round player data
  this.roundPlayers[position].actions.push( 'raise' + (type === 'regular' ? '' : '-' + type) );
  this.roundPlayers[position].bets.push(amount);

  // Handler updates game and tournament data
  this.emit('raise', {position: position, amount: amount, type: type});

  this.nextPosition();
};

Round.prototype.call = function(position) {
  var amount = this.betToCall - this.gamePlayers[position].totalBet;

  if (this.positionToAct !== position) {
    //TODO: emit error
    return;
  }
  //TODO: validate amount <= player.chips

  // Round player data
  this.roundPlayers[position].actions.push( 'call');
  this.roundPlayers[position].bets.push(amount);

  // Handler updates game and tournament data
  this.emit('call', {position: position, amount: amount});

  this.nextPosition();
};

Round.prototype.check = function(position) {
  if (this.positionToAct !== position) {
    //TODO: emit error
    return;
  }

  // Round player data
  this.roundPlayers[position].actions.push('check');

  // Handler updates game and tournament data
  this.emit('check', {position: position});

  this.nextPosition();
};

Round.prototype.fold = function(position) {
  if (this.positionToAct !== position) {
    //TODO: emit error
    return;
  }

  // Round player data
  this.roundPlayers[position].actions.push( 'fold');

  // Handler updates game and tournament data
  this.emit('fold', {position: position});

  this.nextPosition();
};

Round.prototype.end = function() {
  this.emit('end');
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
