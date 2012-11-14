// Tournament starts
// First button was assigned (Miki), game 1 starts
// Bets of small and big blinds are placed

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
    '1': { name: 'Miki',    chips: 12075 },
    '2': { name: 'Giovana', chips:  8975 },
    '3': { name: 'Sofia',   chips:  8975 },
    '4': { name: 'Bianca',  chips:  9975 }
  },
  
  gameCounter: 2,  
  
  button: 2,
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};


var game = {

  number: 2,

  players: [{
    position: 1,
    hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  },{
    position: 2,
    hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  },{
    position: 3,
    hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
    folded  : false,
    totalBet: 10
  },{
    position: 4,
    hand    : [ {rank: 'J', suit: 'C'}, {rank: 'J', suit: 'D'} ],
    folded  : false,
    totalBet: 25
  }],

  button: 2,
  
  blinds: {
    small: 10,
    big  : 25
  },
  
  pot: 35,
  
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
    actions : [],
    bets    : []
  },{
    position: 3,
    actions : ['raise-sb'],
    bets    : [10]
  },{
    position: 4,
    actions : ['raise-bb'],
    bets    : [25]
  }],

  playerToAct: 1,
  finalPlayer: 4,
  
  betToCall: 25
  
};