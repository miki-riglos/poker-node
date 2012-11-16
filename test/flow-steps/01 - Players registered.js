module.exports = {
  name: 'Initial state after player registration',

  forward: function(tournament) {
    
    tournament.registerPlayer(1, "Miki");
    tournament.registerPlayer(2, "Giovana");
    tournament.registerPlayer(3, "Sofia");
    tournament.registerPlayer(4, "Bianca");

    return {
      assert: function() {
        tournament.registeredPlayers[1].name.should.equal( stepTournament.registeredPlayers[1].name );
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
  
  status: 'open',  
  
  registeredPlayers: {
    '1': { name: 'Miki',    chips: 10000},
    '2': { name: 'Giovana', chips: 10000},
    '3': { name: 'Sofia',   chips: 10000},
    '4': { name: 'Bianca',  chips: 10000}
  },
  
  gameCounter: 0,  
  
  button: 0, 
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};


var stepGame = {
};


var stepRound = {
};
