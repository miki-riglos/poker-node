module.exports = {
  name: 'Player 2 (Giovana) folds',

  forward: function(tournament) {
    tournament.currentGame.currentRound.fold(2);
  },

  assert: function(tournament) {
    var tournamentExclusions = ["registeredPlayers", "currentGame", "_events"];
    tournament.stringify(tournamentExclusions).should.equal( stepTournament.stringify(tournamentExclusions) );

    tournament.registeredPlayers.stringify().should.equal( stepTournament.registeredPlayers.stringify() );

    var gameExclusions = ["registeredPlayers", "gamePlayers", "deck", "currentRound", "_events"];
    tournament.currentGame.stringify(gameExclusions).should.equal( stepGame.stringify(gameExclusions) );

    tournament.currentGame.gamePlayers.stringify().should.equal( stepGame.gamePlayers.stringify() );

    var roundExclusions = ["registeredPlayers", "gamePlayers", "roundPlayers", "_events"];
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

  button: 1,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: {
    '1': { name: 'Miki',    chips:  0 },
    '2': { name: 'Giovana', chips:  8975 },
    '3': { name: 'Sofia',   chips:  8975 },
    '4': { name: 'Bianca',  chips:  9975 }
  },

  gameCounter: 1

};


var stepGame = {

  number: 1,

  button: 1,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: stepTournament.registeredPlayers,

  gamePlayers: {
    '1': { hand    : [ {rank: '3', suit: 'C'}, {rank: '7', suit: 'C'} ],
           folded  : false,
           totalBet: 10000 },
    '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
           folded  : true,
           totalBet: 1025 },
    '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
           folded  : false,
           totalBet: 1025 },
    '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
           folded  : true,
           totalBet: 25 }
  },

  pot: 12075,

  deck: [],

  flop : [ {rank: 'J', suit: 'C'}, {rank: 'Q', suit: 'C'}, {rank: 'K', suit: 'C'} ],
  turn : {},
  river: {},

  burnt: [ {"rank":"2","suit":"C"} ],

  winners: [],

  roundCounter: 2

};


var stepRound = {

  number: 2,    // 'preflop'

  button: 1,

  blinds: {
    small: 10,
    big  : 25
  },

  registeredPlayers: stepTournament.registeredPlayers,

  gamePlayers: stepGame.gamePlayers,

  roundPlayers: {
    '1': { actions : ['raise'],
           bets    : [8975] },
    '2': { actions : ['check', 'fold'],
           bets    : [] },
    '3': { actions : ['check'],
           bets    : [] }
  },

  positionToAct: 3,
  finalPosition: 1,

  betToCall: 8975

};
