var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'rooms.json');

var Tournament = require('../poker/tournament').Tournament;

// Room Class
function Room(host) {
  if (!(this instanceof Room)) return new Room(host);
  this.host = host;
  this.started = Date.now();
  this.tournament = new Tournament();
}
Room.prototype.id = function() {
  return this.host + this.started;
};

// RoomManager Class
function RoomManager(options) {
  if (!(this instanceof RoomManager)) return new RoomManager(options);
  _.extend(this, options);
  this.rooms = {};
  this.load();
}

RoomManager.prototype.exist = function(room) {
  return (room.id() in this.rooms);
};

RoomManager.prototype.add = function(host, cb) {
  var roomToAdd = Room(host);
  this.rooms[roomToAdd.id()] = roomToAdd;
  this.save(roomToAdd, cb);
};

RoomManager.prototype.remove = function(room, cb) {
  if (this.exist(room)) {
    var roomToRemove = this.rooms[room.id()];
    delete this.rooms[room.id()];
    this.save(roomToRemove, cb);
  } else {
    if (cb) cb(new Error('Room does not exist.'));
  }
};

RoomManager.prototype.load = function() {
  this.rooms = require(DATA_FILE);
};

RoomManager.prototype.save = function(roomTouched, cb) {
  fs.writeFile(DATA_FILE, JSON.stringify(this.rooms, null, 2), function(err) {
    if (err) {
      if (cb) cb(err);
      return;
    }
    if (cb) cb(null, roomTouched);
  });
};

RoomManager.prototype.playedBy = function(player) {
  var playerRooms = [];
  //TODO
  return playerRooms;
};


// Exports
module.exports = {
  RoomManager: RoomManager
};
