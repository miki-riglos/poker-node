// Flop was dealt
// New round initialize
// Player 2 (Giovana) checks

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
  }],

  button: 1,
  
  blinds: {
    small: 10,
    big  : 25
  },
  
  pot: 3100,
  
  deck: [],
  
  flop : [ {rank: 'A', suit: 'H'}, {rank: 'A', suit: 'S'}, {rank: '2', suit: 'C'}, {rank: '2', suit: 'C'} ],
  turn : {}, 
  river: {},

  winners: []

};


var round = {
  
  number: 2,    // 'flop'

  players: [{
    position: 1,
    actions : [],
    bets    : []
  },{
    position: 2,
    actions : ['checks'],
    bets    : [0]
  },{
    position: 3,
    actions : [],
    bets    : []
  }],

  playerToAct: 3,
  finalPlayer: 2,
  
  betToCall: 0
  
};