var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'rooms.json');

var Tournament = require('../poker/tournament').Tournament;

var keys = Object.keys;

// Room Class
function Room(state) {
  if (typeof state == 'string') {
    this.host       = state;
    this.started    = Date.now();
    this.tournament = new Tournament();
  } else {
    this.host       = state.host;
    this.started    = state.started;
    this.tournament = new Tournament(state.tournament);
  }
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
      players    : this.tournament.players,
      gameCounter: this.tournament.gameCounter,
    }
  };
};


// RoomManager Class
function RoomManager(override) {
  _.extend(this, override);
  this.rooms = {};
  this.load();
}

RoomManager.prototype.exist = function(roomId) {
  return (roomId in this.rooms);
};

RoomManager.prototype.add = function(host, cb) {
  var roomToAdd = new Room(host);
  this.rooms[roomToAdd.id()] = roomToAdd;
  this.save(roomToAdd, cb);
};

RoomManager.prototype.remove = function(roomId, cb) {
  if (this.exist(roomId)) {
    var roomToRemove = this.rooms[roomId];
    delete this.rooms[roomId];
    this.save(roomToRemove, cb);
  } else {
    if (cb) cb(new Error('Room does not exist.'));
  }
};

RoomManager.prototype.read = function() {
  var roomsStr = JSON.stringify({});
  if (fs.existsSync(DATA_FILE)) {
    roomsStr = fs.readFileSync(DATA_FILE);
  }
  return roomsStr;
};

RoomManager.prototype.deserialize = function(roomsStr) {
  var roomsIns = {},
      roomsObj = JSON.parse(roomsStr);

  keys(roomsObj).forEach(function(roomKey) {
    roomsIns[roomKey] = new Room(roomsObj[roomKey]);
  });

  return roomsIns;
};

RoomManager.prototype.load = function() {
  var roomsStr = this.read();
  this.rooms = this.deserialize(roomsStr);
};

RoomManager.prototype.serialize = function(rooms) {
  return JSON.stringify(rooms, null, 2);
};

RoomManager.prototype.write = function(roomsStr, cb) {
  fs.writeFile(DATA_FILE, roomsStr, function(err) {
    cb(err);
  });
};

RoomManager.prototype.save = function(roomTouched, cb) {
  var roomsStr = this.serialize(this.rooms);
  this.write(roomsStr, function(err) {
    if (cb) cb(err, roomTouched.toDTO());
  });
};

RoomManager.prototype.getAllRooms = function() {
  var allRooms = [],
      self     = this;
  keys(this.rooms).forEach(function(key) {
    allRooms.push(self.rooms[key].toDTO());
  });
  return allRooms;
};

//TODO: move to client
//--------------------
// RoomManager.prototype.getRoomsPlayedBy = function(playerName) {
//   var playerRooms = [],
//       self        = this;
//   Object.keys(this.rooms).forEach(function(key) {
//     var allPlayerNames = Object.keys(self.rooms[key].tournament.registeredPlayers).map(function(position) {
//       return self.rooms[key].tournament.registeredPlayers[position].name;
//     });
//     if (allPlayerNames.indexOf(playerName) !== -1) {
//       playerRooms.push( self.rooms[key] );
//     }
//   });
//   return playerRooms;
// };


// Exports
module.exports = {
  Room       : Room,
  RoomManager: RoomManager
};
