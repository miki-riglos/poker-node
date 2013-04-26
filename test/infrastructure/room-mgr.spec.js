/*global describe, it, before, beforeEach, afterEach, after*/
var _ = require('underscore');

var Room        = require('../../infrastructure/room-mgr').Room,
    RoomManager = require('../../infrastructure/room-mgr').RoomManager;

var Table = require('../../poker/table').Table;

var keys = Object.keys;

describe('RoomManager class', function() {
  var roomMgr;
  var override = {
    load: function() {
      this.rooms = {};
    },
    save: function(roomTouched, cb) {
      if (cb) cb(null, roomTouched.toDTO());
    }
  };
  var roomAdded;

  beforeEach(function() {
    roomMgr = new RoomManager(override); // Override load and save methods
  });

  describe('Adding rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should add room', function() {
      roomAdded.host.should.equal('giovana');
    });

    afterEach(function() {
      keys(roomMgr.rooms).should.have.lengthOf(1);
    });
  });

  describe('Removing rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should remove room', function(done) {
      roomMgr.remove(roomAdded.id, function(err, roomRemoved) {
        roomRemoved.host.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing room', function(done) {
      roomMgr.remove(roomAdded.id, function(err, roomRemoved) {
        roomMgr.remove(roomAdded.id, function(err, roomRemoved) {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message');
          done();
        });
      });
    });

    afterEach(function() {
      keys(roomMgr.rooms).should.have.lengthOf(0);
    });

  });

  describe('Deserialization', function() {
    var roomsStr, roomsIns;

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should deserialize rooms', function() {
      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      roomsIns[roomAdded.id].should.be.instanceOf(Room);
      roomsIns[roomAdded.id].table.should.be.instanceOf(Table);

      _.omit(roomsIns[roomAdded.id], 'table').should.eql( _.omit(roomMgr.rooms[roomAdded.id], 'table') );
      // table deserialization in test/poker/deserialization.spec.js
    });

  });

  describe('Getting array of rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomMgr.add('miki', function(err, secondRoomAdded) {
          done();
        });
      });
    });

    it('should return all rooms', function() {
      var allRooms = roomMgr.getAllRooms();
      allRooms.should.be.an.instanceOf(Array);
      allRooms.should.have.lengthOf(2);
    });

  });

  describe('Room events', function() {
    var room1, room2; // instances of Room, not DTO

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, roomAdded) {
        room1 = roomMgr.rooms[roomAdded.id];
        roomMgr.add('miki', function(err, roomAdded) {
          room2 = roomMgr.rooms[roomAdded.id];
          done();
        });
      });
    });

    it('should emit events of rooms in RoomManager', function(done) {
      var counter = 0;
      roomMgr.on('table-start', function() {
        counter++;
        if (counter === 2) {
          done();
        }
      });
      room1.table.registerPlayer(1, 'Giovana'); room1.table.registerPlayer(2, 'Miki');
      room1.table.start();
      room2.table.registerPlayer(1, 'Giovana'); room2.table.registerPlayer(2, 'Miki');
      room2.table.start();
    });

    it('should not emit events of rooms removed from RoomManager', function(done) {
      var counter = {start: 0, end: 0};
      roomMgr.on('table-start', function() {
        counter.start++;
      });
      roomMgr.on('table-end', function() {
        counter.end++;
        counter.start.should.equal(2);
        counter.end.should.equal(1);
        done();
      });
      room1.table.registerPlayer(1, 'Giovana'); room1.table.registerPlayer(2, 'Miki');
      room1.table.start();
      room2.table.registerPlayer(1, 'Giovana'); room2.table.registerPlayer(2, 'Miki');
      room2.table.start();

      roomMgr.remove(room1.id(), function(err, roomRemoved) {
        room1.table.end();  // should not fire event
        room2.table.end();
      });

    });

    it('should pass parameters', function(done) {
      roomMgr.on('table-start', function(roomId, table) {
        roomId.should.equal(room1.id());
        table.should.be.an.instanceOf(Table);
      });
      roomMgr.on('round-check', function(roomId, table, evt) {
        roomId.should.equal(room1.id());
        table.should.be.an.instanceOf(Table);
        evt.should.have.property('position');
        done();
      });
      room1.table.registerPlayer(1, 'Giovana'); room1.table.registerPlayer(2, 'Miki');
      room1.table.start();
      room1.table.game.round.check( room1.table.game.round.positionToAct );
    });

  });

});
