// Player class
function Player(name, chips) {
  if (!(this instanceof Player)) return new Player(name, chips);
  this.name = name;
  this.chips = chips;
}

// Exports
module.exports = {
  Player: Player
};
