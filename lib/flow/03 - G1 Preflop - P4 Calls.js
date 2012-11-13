// Player 4 (Bianca) calls

var tournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialBlinds: {
      small: 10,
      big  : 25
    }
  },
  
  state: 'start',
  
  registeredPlayers: {
    '1': { name: 'Miki',   chips: 10000 },
    '2': { name: 'Giovana',  chips: 10000 },
    '3': { name: 'Sofia', chips: 10000 },
    '4': { name: 'Bianca',    chips: 10000 }
  },
  
  gameCounter: 1,  
  
  button: 1,
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};


var game = {

  number: 1,

  players: [{
    position: 1,
    hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  }, {
    position: 2,
    hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  }, {
    position: 3,
    hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  }, {
    position: 4,
    hand    : [ {rank: 'J', suit: 'C'}, {rank: 'J', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  }],

  button: 1,
  
  blinds: {
    small: 10,
    big  : 25
  },
  
  pot: 0,
  
  deck: [],
  
  flop : [],
  turn : {}, 
  river: {},

  winners: []

};


var round = {
  
  number: 1,    // 'preflop'

  players: [{
    position: 1,
    actions : [],
    bets    : []
  },{
    position: 2,
    actions : ['raise'],
    bets    : [10]
  },{
    position: 3,
    actions : ['raise'],
    bets    : [25]
  },{
    position: 4,
    actions : ['call'],
    bets    : [25]
  }],

  currentPlayer: 1,
  lastPlayer: 3,
  
  betToCall: 25
};