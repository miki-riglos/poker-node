module.exports = {
  name: 'Player 4 (Bianca) calls',

  forward: function(tournament) {
    
    return {
      assert: function() {
        throw new Error('Pending assert');
      }
    };
  }
};


var stepTournament = {

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
    '1': { name: 'Miki',    chips: 10000 },
    '2': { name: 'Giovana', chips:  9990 },
    '3': { name: 'Sofia',   chips:  9975 },
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
    totalBet: 0
  },{
    position: 2,
    hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
    folded  : false,
    totalBet: 10
  },{
    position: 3,
    hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
    folded  : false,
    totalBet: 25
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
  
  pot: 60,
  
  deck: [],
  
  flop : [],
  turn : {}, 
  river: {},

  winners: []

};


var stepRound = {
  
  number: 1,    // 'preflop'

  players: [{
    position: 1,
    actions : [],
    bets    : []
  },{
    position: 2,
    actions : ['raise-sb'],
    bets    : [10]
  },{
    position: 3,
    actions : ['raise-bb'],
    bets    : [25]
  },{
    position: 4,
    actions : ['call'],
    bets    : [25]
  }],

  playerToAct: 1,
  finalPlayer: 3,
  
  betToCall: 25

};