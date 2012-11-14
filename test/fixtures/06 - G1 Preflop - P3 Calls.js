// Player 3 (Sofia) calls

var tournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialBlinds: {
      small: 10,
      big  : 25
    }
  },
  
  status: 'start',
  
  registeredPlayers: {
    '1': { name: 'Miki',    chips:  8975 },
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


var game = {

  number: 1,

  players: [{
    position: 1,
    hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
    folded  : false,
    totalBet: 1025
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
  }, {
    position: 4,
    hand    : [ {rank: 'J', suit: 'C'}, {rank: 'J', suit: 'D'} ],
    folded  : false,
    totalBet: 25
  }],

  button: 1,
  
  blinds: {
    small: 10,
    big  : 25
  },
  
  pot: 3100,
  
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
    actions : ['raise'],
    bets    : [1025]
  },{
    position: 2,
    actions : ['raise-sb', 'call'],
    bets    : [10, 1015]
  },{
    position: 3,
    actions : ['raise-bb', 'call'],
    bets    : [25, 1000]
  },{
    position: 4,
    actions : ['call'],
    bets    : [25]
  }],

  playerToAct: 4,
  finalPlayer: 1,
  
  betToCall: 1025
  
};