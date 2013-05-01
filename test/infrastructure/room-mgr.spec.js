/*global describe, it, before, beforeEach, afterEach, after*/

var RoomManager = require('../../infrastructure/room-mgr').RoomManager,
    override    = require('./setup/room-mgr.over'),
    Room        = require('../../infrastructure/room-mgr').Room,
    Table       = require('../../poker/table').Table;

var _ = require('underscore');

var keys = Object.keys;

describe('RoomManager class', function() {
  var roomMgr,
      roomGiova;

  beforeEach(function() {
    roomMgr = new RoomManager(override); // Override load and save methods
  });

  describe('Adding rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, roomAdded) {
        roomGiova = roomAdded;
        done();
      });
    });

    it('should add room', function() {
      roomGiova.host.should.equal('giovana');
    });

    afterEach(function() {
      keys(roomMgr.rooms).should.have.lengthOf(1);
    });
  });

  describe('Removing rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, roomAdded) {
        roomGiova = roomAdded;
        done();
      });
    });

    it('should remove room', function(done) {
      roomMgr.remove(roomGiova.id, function(err, roomRemoved) {
        roomRemoved.host.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing room', function(done) {
      roomMgr.remove(roomGiova.id, function(err, roomRemoved) {
        roomMgr.remove(roomGiova.id, function(err, roomRemoved) {
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
      roomMgr.add('giovana', function(err, roomAdded) {
        roomGiova = roomAdded;
        done();
      });
    });

    it('should deserialize rooms', function() {
      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      roomsIns[roomGiova.id].should.be.instanceOf(Room);
      roomsIns[roomGiova.id].table.should.be.instanceOf(Table);

      _.omit(roomsIns[roomGiova.id], 'table').should.eql( _.omit(roomMgr.rooms[roomGiova.id], 'table') );
      // table deserialization in test/poker/deserialization.spec.js
    });

  });

  describe('Getting array of rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, roomAdded) {
        roomMgr.add('miki', done);
      });
    });

    it('should return all rooms', function() {
      var allRooms = roomMgr.getAllRooms();
      allRooms.should.be.an.instanceOf(Array);
      allRooms.should.have.lengthOf(2);
    });

  });

  describe('Room events', function() {
    var roomGiova, roomSofia; // instances of Room, not DTO

    beforeEach(function(done) {
      roomMgr.add('giova', function(err, roomAdded) {
        roomGiova = roomMgr.rooms[roomAdded.id];
        roomMgr.add('sofia', function(err, roomAdded) {
          roomSofia = roomMgr.rooms[roomAdded.id];
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
      roomGiova.table.registerPlayer(1, 'Giovana'); roomGiova.table.registerPlayer(2, 'Miki');
      roomGiova.table.start();
      roomSofia.table.registerPlayer(1, 'Giovana'); roomSofia.table.registerPlayer(2, 'Miki');
      roomSofia.table.start();
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
      roomGiova.table.registerPlayer(1, 'Giovana'); roomGiova.table.registerPlayer(2, 'Miki');
      roomGiova.table.start();
      roomSofia.table.registerPlayer(1, 'Giovana'); roomSofia.table.registerPlayer(2, 'Miki');
      roomSofia.table.start();

      roomMgr.remove(roomGiova.id(), function(err, roomRemoved) {
        roomGiova.table.end();  // should not fire event
        roomSofia.table.end();
      });

    });

    it('should pass parameters', function(done) {
      roomMgr.on('table-start', function(roomId, table) {
        roomId.should.equal(roomGiova.id());
        table.should.be.an.instanceOf(Table);
      });
      roomMgr.on('round-check', function(roomId, table, evt) {
        roomId.should.equal(roomGiova.id());
        table.should.be.an.instanceOf(Table);
        evt.should.have.property('position');
        done();
      });
      roomGiova.table.registerPlayer(1, 'Giovana'); roomGiova.table.registerPlayer(2, 'Miki');
      roomGiova.table.start();
      roomGiova.table.game.round.check( roomGiova.table.game.round.positionToAct );
    });

  });

});
