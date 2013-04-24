module.exports = {

  name: 'Initial state after players registration',

  initialStep: { getFinalState: function() { return undefined; } },

  forward: function(table) {
    table.registerPlayer(1, 'Miki');
    table.registerPlayer(2, 'Giovana');
    table.registerPlayer(3, 'Sofia');
    table.registerPlayer(4, 'Bianca');
  },

  getFinalState: function() {
    return {
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
    };
  }
};
