var Tournament = require('../lib/tournament');

var counter = 0,
    rooms   = {};

function Room(host) {
  if (!(this instanceof Room)) return new Room();
  this.host = host;
  this.started = Date.now();
  this.tournament = new Tournament();
}

function add(host) {
  counter++;
  rooms[counter] = Room(host);
}

function playedBy(player) {
  var playerRooms = [];
  //TODO
  return playerRooms;
}

// Exports
module.exports = {
  add: add
};
