var tournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialSmallBlind: 10,
    initialBigBlind: 25
  },

  status: 'open',   // 'open' | 'start' | 'suspend' | 'end'

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

  button: 1,    // position of Player

  blinds: {
    small: 10,
    big  : 25
  },

  players: [{
    position: 1,      // only active players, won't include players with no chips
    player  : {},     // Player
    hand    : [],     // Card[]
    folded  : false
  }],

  pot: 35,

  deck: [],   // Cards[]

  flop : [ {rank: "2", suit: "C"}, {rank: "3", suit: "C"}, {rank: "4", suit: "C"} ],   // Card[]
  turn : {rank: "6", suit: "C"},   // Card
  river: {rank: "5", suit: "C"},   // Card

  winners: [1]    // positions of Player (could be a tie)

};

var round = {

  number: 1,    // 1: 'preflop' | 2: 'flop' | 3: 'turn' | 4: 'river'

  button: 1,    // position of Player

  blinds: {
    small: 10,
    big  : 25
  },

  players: [{
    position: 1,      // only active players, won't include players who folded
    player  : {},     // Player
    actions : [],      // raise-sb, raise-bb, call, raise, fold
    bets    : [25]    // Array of bets (could be more than 1 per round)
  }],

  playerToAct: 1,   // position of Player
  finalPlayer: 1,   // position of Player where the round ends, first time is button+2, next times button

  betToCall: 25     // first time is big blind, next times 0

};
