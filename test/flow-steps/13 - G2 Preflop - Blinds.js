module.exports = {
  name: 'Game 2 starts',

  forward: function(tournament) {
    // Giovana is button now
    // Bets of small and big blinds are placed
    // -- new game starts automatically in process.nextTick()
  },

  assert: function(tournament) {
    var tournamentExclusions = ['registeredPlayers', 'currentGame', '_events'];
    tournament.stringify(tournamentExclusions).should.equal( stepTournament.stringify(tournamentExclusions) );

    tournament.registeredPlayers.stringify().should.equal( stepTournament.registeredPlayers.stringify() );

    var gameExclusions = ['registeredPlayers', 'gamePlayers', 'deck', 'currentRound', '_events'];
    tournament.currentGame.stringify(gameExclusions).should.equal( stepGame.stringify(gameExclusions) );

    tournament.currentGame.gamePlayers.stringify().should.equal( stepGame.gamePlayers.stringify() );

    var roundExclusions = ['registeredPlayers', 'gamePlayers', 'roundPlayers', '_events'];
    tournament.currentGame.currentRound.stringify(roundExclusions).should.equal( stepRound.stringify(roundExclusions) );

    tournament.currentGame.currentRound.roundPlayers.stringify().should.equal( stepRound.roundPlayers.stringify() );
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

  button: 2,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: {
    '1': { name: 'Miki',    chips: 12075 },
    '2': { name: 'Giovana', chips:  8975 },
    '3': { name: 'Sofia',   chips:  8965 },
    '4': { name: 'Bianca',  chips:  9950 }
  },

  gameCounter: 2

};


var stepGame = {

  number: 2,

  button: 2,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: stepTournament.registeredPlayers,

  gamePlayers: {
    '1': { hand    : [ {rank: '3', suit: 'C'}, {rank: '7', suit: 'C'} ],
           folded  : false,
           totalBet: 0 },
    '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
           folded  : false,
           totalBet: 0 },
    '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
           folded  : false,
           totalBet: 10 },
    '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
           folded  : false,
           totalBet: 25 }
  },

  pot: 35,

  deck: [],

  flop : [],
  turn : {},
  river: {},

  burnt: [ {'rank':'2','suit':'C'} ],

  winners: [],

  roundCounter: 1

};


var stepRound = {

  number: 1,    // 'preflop'

  button: 2,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: stepTournament.registeredPlayers,

  gamePlayers: stepGame.gamePlayers,

  roundPlayers: {
    '1': { actions : [],
           bets    : [] },
    '2': { actions : [],
           bets    : [] },
    '3': { actions : ['raise-sb'],
           bets    : [10] },
    '4': { actions : ['raise-bb'],
           bets    : [25] }
  },

  positionToAct: 1,
  finalPosition: 4,

  betToCall: 25

};
