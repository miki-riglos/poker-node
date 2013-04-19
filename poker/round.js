var util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var keys = Object.keys;

// Game initial state
function getRoundInitialState() {
  var roundInitialState = {
    number       : 0,     // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'
    actionsInfo  : {},    // {position: {actions: String[], bets: Number[]} }
    positionToAct: null,  // position of Player
    hasActed     : null,  // Number[] with positions that already acted, reinitialized when raise
    betToCall    : null
  };
  return roundInitialState;
}

// Round class
function Round(game, state) {
  this.tournament = game.tournament;
  this.game       = game;

  _.extend(this, getRoundInitialState());

  if (!state) {
    this.number      = this.game.roundCounter;
    this.actionsInfo = getActionsInfo( this.game.getPositionsActing() );
  } else {
    _.extend(this, state);
  }

  events.EventEmitter.call(this);
}
util.inherits(Round, events.EventEmitter);

Round.prototype.start = function(state) {
  this.positionToAct = this.tournament.button;
  this.nextPosition();
  this.hasActed = [];
  this.betToCall     = 0;

  this.emit('start');

  // If preflop place blinds
  if (this.number === 1) {
    // small blind
    this.raise(this.positionToAct, this.tournament.blinds.small, 'sb');
    // big blind
    this.raise(this.positionToAct, this.tournament.blinds.big, 'bb');
  } else {
    this.nextPosition();
  }

};

Round.prototype.nextPosition = function() {
  var initialPosition = this.positionToAct,
      runningPosition = initialPosition,
      maximumPosition = Math.max.apply(Math, keys(this.actionsInfo).map(function(key) { return +key; }));

  do {
    ++runningPosition;
    if (runningPosition > maximumPosition ) runningPosition = 1;

    if (_.contains(this.hasActed, runningPosition)) break;

    if (this.actionsInfo[runningPosition]) {
      if (!this.game.handsInfo[runningPosition].folded && this.tournament.players[runningPosition].chips > 0) {
        break;
      }
    }

  } while (runningPosition != initialPosition);

  this.positionToAct = runningPosition;

  if (_.contains(this.hasActed, this.positionToAct)) {
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
  this.betToCall = amount;

  // Round player data
  this.actionsInfo[position].actions.push( 'raise' + (type === 'regular' ? '' : '-' + type) );
  this.actionsInfo[position].bets.push(amount);

  // hasActed
  if (type === 'regular') {
    this.hasActed = [position];
  }

  // Handler updates game and tournament data
  this.emit('raise', {position: position, amount: amount, type: type});

  this.nextPosition();
};

Round.prototype.call = function(position) {
  var amount = this.betToCall - this.game.handsInfo[position].totalBet;

  if (this.positionToAct !== position) {
    //TODO: emit error
    return;
  }
  //TODO: validate amount <= player.chips

  // Round player data
  this.actionsInfo[position].actions.push( 'call');
  this.actionsInfo[position].bets.push(amount);

  this.hasActed.push(position);

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
  this.actionsInfo[position].actions.push('check');

  this.hasActed.push(position);

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
  this.actionsInfo[position].actions.push( 'fold');

  this.hasActed.push(position);

  // Handler updates game and tournament data
  this.emit('fold', {position: position});

  this.nextPosition();
};

Round.prototype.end = function() {
  this.positionToAct = null; // if there is a reference to this round after it ends, disables actions
  this.emit('end');
};

Round.prototype.toJSON = function() {
  return _.omit(this, ['tournament', 'game', '_events']);
};

// Private
function getActionsInfo(activePositions) {
  var actionsInfo = {};

  activePositions.forEach(function(position) {
    actionsInfo[position] = {
      actions: [],
      bets   : []
    };
  });

  return actionsInfo;
}


// Exports
module.exports = {
  Round: Round
};
