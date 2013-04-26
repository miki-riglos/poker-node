var fs     = require('fs'),
    path   = require('path'),
    util   = require('util'),
    events = require('events'),
    _      = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'rooms.json');

var Table = require('../poker/table').Table;

var keys = Object.keys;

var tableEvents = ['table-start',
                   'table-error',
                   'table-button',
                   'game-start',
                   'round-start',
                   'round-error',
                   'round-next',
                   'round-raise',
                   'round-call',
                   'round-check',
                   'round-fold',
                   'round-end',
                   'game-end',
                   'table-end'];

// Room Class
function Room(state) {
  if (typeof state == 'string') {
    this.host    = state;
    this.started = Date.now();
    this.table   = new Table();
  } else {
    this.host    = state.host;
    this.started = state.started;
    this.table   = new Table(state.table);
  }
}

Room.prototype.id = function() {
  return this.host + this.started;
};

Room.prototype.toDTO = function() {
  return {
    id     : this.id(),
    host   : this.host,
    started: this.started,
    table  : {
      status : this.table.status,
      players: this.table.players
    }
  };
};


// RoomManager Class
function RoomManager(override) {
  _.extend(this, override);
  this.rooms = {};
  this.eventHandlers = {};   // hold reference to event handlers for each room to remove them later
  events.EventEmitter.call(this);
  this.load();
}
util.inherits(RoomManager, events.EventEmitter);

RoomManager.prototype.exist = function(roomId) {
  return (roomId in this.rooms);
};

RoomManager.prototype.onTableEvents = function(room) {
  var self = this;

  this.eventHandlers[room.id()] = {};

  tableEvents.forEach(function(event) {
    var handler = function(table, evt) {
      self.emit(event, room.id(), table, evt);
    };

    room.table.on(event, handler);

    self.eventHandlers[room.id()][event] = handler;
  });
};

RoomManager.prototype.offTableEvents = function(roomId) {
  var self = this;
  tableEvents.forEach(function(event) {
    self.rooms[roomId].table.removeListener(event, self.eventHandlers[roomId][event]);
  });

  delete this.eventHandlers[roomId];
};

RoomManager.prototype.add = function(host, cb) {
  var roomToAdd = new Room(host);
  this.rooms[roomToAdd.id()] = roomToAdd;
  this.onTableEvents(roomToAdd);
  this.save(roomToAdd, cb);
};

RoomManager.prototype.remove = function(roomId, cb) {
  if (this.exist(roomId)) {
    var roomToRemove = this.rooms[roomId];
    this.offTableEvents(roomId);
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
  //TODO: events for each room
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


// Exports
module.exports = {
  Room       : Room,
  RoomManager: RoomManager
};
