// Player class
function Player(name, chips) {
  if (!(this instanceof Player)) return new Player(name, chips);
  if (typeof name == 'string') {
    this.name  = name;
    this.chips = chips;
  } else {
    var init = name;
    this.name  = init.name;
    this.chips = init.chips;
  }
}

// Exports
module.exports = {
  Player: Player
};
