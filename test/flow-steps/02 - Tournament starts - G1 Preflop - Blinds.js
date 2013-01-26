var Deck  = require("../../lib/deck").Deck;

module.exports = {
  name: 'Tournament starts',

  forward: function(tournament) {
    // First button was assigned (Miki), game 1 starts
    // Bets of small and big blinds are placed
    tournament.start();
    tournament.button = 1;  // Reassign for testing
    tournament.currentGame.deck = new Deck(); // Reassign for testing
  },

  assert: function(tournament) {
    var tournamentExclusion = function(key, value) { return ["players", "currentGame"].indexOf(key) != -1 ? undefined : value },
        tournamentJson      = JSON.stringify(tournament, tournamentExclusion),
        stepTournamentJson  = JSON.stringify(stepTournament, tournamentExclusion);

    var tournamentPlayersJson     = JSON.stringify(tournament.registeredPlayers),
        stepTournamentPlayersJson = JSON.stringify(stepTournament.registeredPlayers);

    var gameExclusion      = function(key, value) { return ["players", "deck"].indexOf(key) != -1 ? undefined : value },
        currentGameJson    = JSON.stringify(tournament.currentGame, gameExclusion),
        stepGameJson       = JSON.stringify(stepGame, gameExclusion);

    var currentGamePlayersJson    = JSON.stringify(tournament.currentGame.players),
        stepGamePlayersJson       = JSON.stringify(stepGame.players);

    describe("Step 2 Details", function() {
      it("tournament -players -currentGame", function() {
        tournamentJson.should.equal(stepTournamentJson);
      });
      it("tournament players", function() {
        tournamentPlayersJson.should.equal(stepTournamentPlayersJson);
      });

      it("currentGame -players -deck", function() {
        currentGameJson.should.equal(stepGameJson);
      });
      it("currentGame players", function() {
        currentGamePlayersJson.should.equal(stepGamePlayersJson);
      });
    });
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
    '1': { name: 'Miki',    chips: 10000 },
    '2': { name: 'Giovana', chips:  9990 },
    '3': { name: 'Sofia',   chips:  9975 },
    '4': { name: 'Bianca',  chips: 10000 }
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

  players: {
    '1': { player  : stepTournament.registeredPlayers['1'],
           hand    : [ {rank: 'A', suit: 'C'}, {rank: 'A', suit: 'D'} ],
           folded  : false,
           totalBet: 0 },
    '2': { player  : stepTournament.registeredPlayers['2'],
           hand    : [ {rank: 'K', suit: 'C'}, {rank: 'K', suit: 'D'} ],
           folded  : false,
           totalBet: 10 },
    '3': { player  : stepTournament.registeredPlayers['3'],
           hand    : [ {rank: 'Q', suit: 'C'}, {rank: 'Q', suit: 'D'} ],
           folded  : false,
           totalBet: 25 },
    '4': { player  : stepTournament.registeredPlayers['4'],
           hand    : [ {rank: 'J', suit: 'C'}, {rank: 'J', suit: 'D'} ],
           folded  : false,
           totalBet: 0 }
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