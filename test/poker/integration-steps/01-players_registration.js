module.exports = {

  name: 'Initial state after players registration',

  initialState: undefined,

  forward: function(tournament) {
    tournament.registerPlayer(1, 'Miki');
    tournament.registerPlayer(2, 'Giovana');
    tournament.registerPlayer(3, 'Sofia');
    tournament.registerPlayer(4, 'Bianca');
  },

  finalState: {
    options: {
      initialChips  : 10000,
      maximumPlayers: 10,
      initialBlinds : {
        small: 10,
        big  : 25
      }
    },
    status: 'open',
    button: null,
    blinds: {
      small: 10,
      big  : 25
    },
    players: {
      '1': { name: 'Miki',    chips: 10000},
      '2': { name: 'Giovana', chips: 10000},
      '3': { name: 'Sofia',   chips: 10000},
      '4': { name: 'Bianca',  chips: 10000}
    },
    gameCounter: 0,
    game: null
  }

};
