// Initial state after player registration

var tournament = {

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
    '1': { name: 'Sofia',   chips: 10000},
    '2': { name: 'Bianca',  chips: 10000},
    '3': { name: 'Giovana', chips: 10000},
    '4': { name: 'Miki',    chips: 10000}
  },
  
  gameCounter: 0,  
  
  button: 0, 
  
  blinds: {
    small: 10,
    big  : 25
  }
  
};


var game = {
};


var round = {
};
