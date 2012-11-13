var tournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialBlinds: {
      small: 10,
      big  : 25
    }
    // define how blinds increase (when and how)
  },
  
  state: 'open',   // 'open' | 'start' | 'suspend' | 'end'
  
  registeredPlayers: {
    '1': {}     // position: Player
  },
  
  gameCounter: 0,  
  
  button: 1,    // position of Player
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};

var game = {

  number: 1,

  players: [{
    position: 1,      // only active players, wont include players with no chips
    hand    : [],     // Card[]
    folded  : false
  }],

  button: 1,    // position of Player
  
  blinds: {
    small: 10,
    big  : 25
  },
  
  pot: 35, 
  
  deck: [],   // Cards[]
  
  flop : [ {rank: "2", suit: "C"}, {rank: "3", suit: "C"}, {rank: "4", suit: "C"} ],   // Card[]
  turn : {rank: "6", suit: "C"},   // Card
  river: {rank: "5", suit: "C"},   // Card

  winners: [1]    // positions of Player (could be a tie)
  
};

var round = {
  
  number: 1,    // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'

  players: [{
    position: 1,      // only active players, wont include players who folded
    bets    : [25]    // Array of bets (could be more than 1 per round)
  }],

  currentPlayer: 1,   // position of Player
  lastPlayer: 1,      // position of Player where the round ends, first time is button+2, next times button
  
  betToCall: 25       // first time is big blind, next times 0
};