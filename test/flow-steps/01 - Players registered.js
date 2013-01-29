module.exports = {
  name: 'Initial state after player registration',

  forward: function(tournament) {
    tournament.registerPlayer(1, "Miki");
    tournament.registerPlayer(2, "Giovana");
    tournament.registerPlayer(3, "Sofia");
    tournament.registerPlayer(4, "Bianca");
  },

  assert: function(tournament) {
    tournament.stringify().should.equal(stepTournament.stringify());
  }
};


var stepTournament = {

  options: {
    initialChips  : 10000,
    maximumPlayers: 10,
    initialSmallBlind: 10,
    initialBigBlind: 25
  },

  status: 'open',

  button: null,

  blinds: {
    small: 10,
    big  : 25
  },

registeredPlayers: {
    '1': { name: 'Miki',    chips: 10000},
    '2': { name: 'Giovana', chips: 10000},
    '3': { name: 'Sofia',   chips: 10000},
    '4': { name: 'Bianca',  chips: 10000}
  },

  gameCounter: 0

};


var stepGame = {
};


var stepRound = {
};
