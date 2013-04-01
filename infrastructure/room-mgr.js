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

RoomManager.prototype.exist = function(roomId) {
  return (roomId in this.rooms);
};

RoomManager.prototype.add = function(host, cb) {
  var roomToAdd = Room(host);
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
  var flatRooms = JSON.stringify({});
  if (fs.existsSync(DATA_FILE)) {
    flatRooms = fs.readFileSync(DATA_FILE);
  }
  return flatRooms;
};

RoomManager.prototype.deserialize = function(flatRooms) {
  var roomsIns = {},
      roomsObj = JSON.parse(flatRooms);

  Object.keys(roomsObj).forEach(function(roomKey) {
    roomsIns[roomKey] = Room(roomsObj[roomKey].host);
    _.extend(roomsIns[roomKey], roomsObj[roomKey]);
    // roomsIns[roomKey].started = roomsObj[roomKey].started;
  });

  return roomsIns;
};

RoomManager.prototype.load = function() {
  var flatRooms = this.read();
  this.rooms = this.deserialize(flatRooms);
};

RoomManager.prototype.serialize = function(rooms) {
  return JSON.stringify(rooms, null, 2);
};

RoomManager.prototype.write = function(flatRooms, cb) {
  fs.writeFile(DATA_FILE, flatRooms, function(err) {
    cb(err);
  });
};

RoomManager.prototype.save = function(roomTouched, cb) {
  var flatRooms = this.serialize(this.rooms);
  this.write(flatRooms, function(err) {
    if (cb) cb(err, roomTouched.toDTO());
  });
};

RoomManager.prototype.getAllRooms = function() {
  var allRooms = [],
      self     = this;
  Object.keys(this.rooms).forEach(function(key) {
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
