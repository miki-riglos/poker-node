define(function() {

  function playersToArray(players) {
    
    var playersArray = [];
    
    Object.keys(players).forEach(function(key) {
      playersArray.push(players[key].name);
    });
    
    return playersArray;
  }

  return playersToArray;
});