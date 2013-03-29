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

Room.prototype.toDTO = function() {
  return {
    id        : this.id(),
    host      : this.host,
    started   : this.started,
    tournament: {
      status     : this.tournament.status,
      players    : this.tournament.registeredPlayers,
      gameCounter: this.tournament.gameCounter,
    }
  };
};


// RoomManager Class
function RoomManager(override) {
  if (!(this instanceof RoomManager)) return new RoomManager(override);
  _.extend(this, override);
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

RoomManager.prototype.read = function() {
  var flatRooms = JSON.parse({});
  if (fs.existsSync(DATA_FILE)) {
    flatRooms = require(DATA_FILE);
  }
  return flatRooms;
};

RoomManager.prototype.deserialize = function(flatRooms) {
  var self = this;
  this.rooms = {};
  Object.keys(JSON.parse(flatRooms)).forEach(function(roomObjKey) {
    self.rooms[roomObjKey] = new Room( flatRooms[roomObjKey].host );
    _.extend(self.rooms[roomObjKey], flatRooms[roomObjKey]);
    _.extend(self.rooms[roomObjKey].tournament, flatRooms[roomObjKey].tournament);
    //TODO: other nestes classes
  });
};

RoomManager.prototype.load = function() {
  var flatRooms = this.read();
  this.deserialize(flatRooms);
};

RoomManager.prototype.save = function(roomTouched, cb) {
  fs.writeFile(DATA_FILE, JSON.stringify(this.rooms, null, 2), function(err) {
    if (err) {
      if (cb) cb(err);
      return;
    }
    if (cb) cb(null, roomTouched.toDTO());
  });
};

RoomManager.prototype.getAllRooms = function() {
  var allRooms = [],
      self     = this;
  Object.keys(this.rooms).forEach(function(key) {
    allRooms.push( self.rooms[key].toDTO() );
  });
  return allRooms;
};

RoomManager.prototype.getRoomsPlayedBy = function(playerName) {
  var playerRooms = [],
      self        = this;
  Object.keys(this.rooms).forEach(function(key) {
    var allPlayerNames = Object.keys(self.rooms[key].tournament.registeredPlayers).map(function(position) {
      return self.rooms[key].tournament.registeredPlayers[position].name;
    });
    if (allPlayerNames.indexOf(playerName) !== -1) {
      playerRooms.push( self.rooms[key].toDTO() );
    }
  });
  return playerRooms;
};


// Exports
module.exports = {
  RoomManager: RoomManager
};
