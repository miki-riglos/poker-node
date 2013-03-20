var RoomManager = require('../../infrastructure/room-mgr').RoomManager;

describe('RoomManager class', function() {
  var roomMgr;
  var options = {
    load: function() {
      this.rooms = {};
    },
    save: function(roomTouched, cb) {
      if (cb) cb(null, roomTouched);
    }
  };
  var roomAdded;

  beforeEach(function() {
    roomMgr = RoomManager(options); // Overwrite load and save methods
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
      roomMgr.remove(roomAdded, function(err, roomRemoved) {
        roomRemoved.host.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing room', function(done) {
      roomMgr.remove(roomAdded, function(err, roomRemoved) {
        roomMgr.remove(roomAdded, function(err, roomRemoved) {
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
    var room1, room2;

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        room1 = firstRoomAdded;
        room1.tournament.registerPlayer(1, 'giovana');
        room1.tournament.registerPlayer(2, 'sofia');
        roomMgr.add('miki', function(err, secondRoomAdded) {
          room2 = secondRoomAdded;
          room2.tournament.registerPlayer(1, 'miki');
          room2.tournament.registerPlayer(2, 'sofia');
          done();
        });
      });
    });

    it('should return all rooms', function() {
      var allRooms = roomMgr.getAllRooms();
      allRooms.should.be.instanceOf(Array);
      allRooms.should.have.length(2);
    });

    it('should return rooms of a given player', function() {
      var roomsOfSofia = roomMgr.getRoomsPlayedBy('sofia');
      roomsOfSofia.should.be.instanceOf(Array);
      roomsOfSofia.should.have.length(2);

      roomMgr.getRoomsPlayedBy('giovana').should.have.length(1);
      roomMgr.getRoomsPlayedBy('miki').should.have.length(1);
    });

  });

});