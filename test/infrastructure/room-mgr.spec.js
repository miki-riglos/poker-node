var RoomManager = require('../../infrastructure/room-mgr').RoomManager;

describe('RoomManager class', function() {
  var roomMgr;
  var override = {
    load: function() {
      this.rooms = {};
    },
    save: function(roomTouched, cb) {
      if (cb) cb(null, roomTouched);
    }
  };
  var roomAdded;

  beforeEach(function() {
    roomMgr = RoomManager(override); // Override load and save methods
  });

  describe('adding rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should add room', function(done) {
      roomAdded.host.should.equal('giovana');
      done();
    });

    afterEach(function() {
      Object.keys(roomMgr.rooms).should.have.length(1);
    });
  });

  describe('removing rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should remove room', function(done) {
      roomMgr.remove(roomAdded.id(), function(err, roomRemoved) {
        roomRemoved.host.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing room', function(done) {
      roomMgr.remove(roomAdded.id(), function(err, roomRemoved) {
        roomMgr.remove(roomAdded.id(), function(err, roomRemoved) {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message');
          done();
        });
      });
    });

    afterEach(function() {
      Object.keys(roomMgr.rooms).should.have.length(0);
    });

  });

  describe('getting array of rooms', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomMgr.add('miki', function(err, secondRoomAdded) {
          done();
        });
      });
    });

    it('should return all rooms', function() {
      var allRooms = roomMgr.getAllRooms();
      allRooms.should.be.instanceOf(Array);
      allRooms.should.have.length(2);
    });

  });

});