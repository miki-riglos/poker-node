module.exports = {
  name: 'Game 1 ends, Player 1 (Miki) wins',

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
    '1': { name: 'Miki',    chips: 12075 },
    '2': { name: 'Giovana', chips:  8975 },
    '3': { name: 'Sofia',   chips:  8975 },
    '4': { name: 'Bianca',  chips:  9975 }
  },
  
  gameCounter: 1,  
  
  button: 2,
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};


var stepGame = {
};


var stepRound = {
};
