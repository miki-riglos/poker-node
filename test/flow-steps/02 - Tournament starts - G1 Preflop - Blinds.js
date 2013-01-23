module.exports = {
  name: 'Tournament starts',

  forward: function(tournament) {
    // First button was assigned (Miki), game 1 starts
    // Bets of small and big blinds are placed
    tournament.start();
    tournament.button = 1;  // Reassign for testing
  },

  assert: function(tournament) {

    var tournamentJson     = JSON.stringify(tournament, function(key, value) { return key == "currentGame" ? undefined : value }),
        stepTournamentJson = JSON.stringify(stepTournament);

    var currentGameJson    = JSON.stringify(tournament.currentGame),
        stepGameJson       = JSON.stringify(stepGame);

    tournamentJson.should.equal(stepTournamentJson);
    currentGameJson.should.equal(stepGameJson);
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
    '1': { name: 'Miki',    chips: 10000 },
    '2': { name: 'Giovana', chips:  9990 },
    '3': { name: 'Sofia',   chips:  9975 },
    '4': { name: 'Bianca',  chips: 10000 }
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
    player  : stepTournament.registeredPlayers['1'],
    hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  },{
    position: 2,
    player  : stepTournament.registeredPlayers['2'],
    hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
    folded  : false,
    totalBet: 10
  },{
    position: 3,
    player  : stepTournament.registeredPlayers['3'],
    hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
    folded  : false,
    totalBet: 25
  },{
    position: 4,
    player  : stepTournament.registeredPlayers['4'],
    hand    : [ {rank: 'J', suit: 'C'}, {rank: 'J', suit: 'D'} ],
    folded  : false,
    totalBet: 0
  }],

  button: 1,

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


var stepRound = {

  number: 1,    // 'preflop'

  players: [{
    position: 1,
    player  : stepTournament.registeredPlayers['1'],
    actions : [],
    bets    : []
  },{
    position: 2,
    player  : stepTournament.registeredPlayers['2'],
    actions : ['raise-sb'],
    bets    : [10]
  },{
    position: 3,
    player  : stepTournament.registeredPlayers['3'],
    actions : ['raise-bb'],
    bets    : [25]
  },{
    position: 4,
    player  : stepTournament.registeredPlayers['4'],
    actions : [],
    bets    : []
  }],

  playerToAct: 4,
  finalPlayer: 3,

  betToCall: 25

};