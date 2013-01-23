module.exports = {
  name: 'Player 1 (Miki) raises (all in)',

  forward: function(tournament) {
  },

  assert: function(tournament) {
    throw new Error('Pending assert');
  }
};


var stepTournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialSmallBlind: 10,
    initialBigBlind: 25
  },

  status: 'start',

  registeredPlayers: {
    '1': { name: 'Miki',    chips:  0 },
    '2': { name: 'Giovana', chips:  8975 },
    '3': { name: 'Sofia',   chips:  8975 },
    '4': { name: 'Bianca',  chips:  9975 }
  },

  gameCounter: 1,

  button: 1,

  blinds: {
    small: 10,
    big  : 25
  }

};


var stepGame = {

  number: 1,

  players: [{
    position: 1,
    hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
    folded  : false,
    totalBet: 10000
  },{
    position: 2,
    hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
    folded  : false,
    totalBet: 1025
  },{
    position: 3,
    hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
    folded  : false,
    totalBet: 1025
  }],

  button: 1,

  blinds: {
    small: 10,
    big  : 25
  },

  pot: 12075,

  deck: [],

  flop : [ {rank: 'A', suit: 'H'}, {rank: 'A', suit: 'S'}, {rank: '2', suit: 'C'}, {rank: '2', suit: 'C'} ],
  turn : {},
  river: {},

  winners: []

};


var stepRound = {

  number: 2,    // 'flop'

  players: [{
    position: 1,
    actions : ['raises-ai'],
    bets    : [8975]
  },{
    position: 2,
    actions : ['checks'],
    bets    : [0]
  },{
    position: 3,
    actions : ['checks'],
    bets    : [0]
  }],

  playerToAct: 2,
  finalPlayer: 1,

  betToCall: 8975

};