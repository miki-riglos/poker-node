var Room        = require('../../infrastructure/room-mgr').Room,
    RoomManager = require('../../infrastructure/room-mgr').RoomManager;

var Tournament = require('../../poker/tournament').Tournament,
    Player     = require('../../poker/player').Player,
    Game       = require('../../poker/game').Game,
    Deck       = require('../../poker/deck').Deck;

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
      Object.keys(roomMgr.rooms).should.have.length(0);
    });

  });

  describe('serialization', function() {
    var roomsStr, roomsIns;

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        done();
      });
    });

    it('should serialize/deserialize rooms', function() {
      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      roomsIns[roomAdded.id].should.be.an.instanceOf(Room);
      roomsIns[roomAdded.id].host.should.equal(roomAdded.host);
      roomsIns[roomAdded.id].started.should.equal(roomAdded.started);

      roomsIns[roomAdded.id].tournament.should.be.an.instanceOf(Tournament);
      roomsIns[roomAdded.id].tournament.should.have.property('status', 'open');
      roomsIns[roomAdded.id].tournament.should.have.property('button', null);
      roomsIns[roomAdded.id].tournament.registeredPlayers.should.eql({});  //deepEqual
      roomsIns[roomAdded.id].tournament.should.have.property('gameCounter', 0);
      roomsIns[roomAdded.id].tournament.should.have.property('currentGame', null);
    });

    it('should serialize/deserialize rooms with ongoing tournaments', function() {
      roomMgr.rooms[roomAdded.id].tournament.registerPlayer(1, 'Miki');
      roomMgr.rooms[roomAdded.id].tournament.registerPlayer(2, 'Giovana');
      roomMgr.rooms[roomAdded.id].tournament.registerPlayer(3, 'Sofia');
      roomMgr.rooms[roomAdded.id].tournament.registerPlayer(4, 'Bianca');
      roomMgr.rooms[roomAdded.id].tournament.start();

      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      roomsIns[roomAdded.id].should.be.an.instanceOf(Room);
      roomsIns[roomAdded.id].tournament.should.be.an.instanceOf(Tournament);
      roomsIns[roomAdded.id].tournament.should.have.property('status', 'start');
      roomsIns[roomAdded.id].tournament.should.have.property('button');
      roomsIns[roomAdded.id].tournament.button.should.be.ok;
      [1, 2, 3, 4].forEach(function(pos) {
        roomsIns[roomAdded.id].tournament.registeredPlayers[pos].should.be.an.instanceOf(Player);
        roomsIns[roomAdded.id].tournament.registeredPlayers[pos].name.should.equal(roomMgr.rooms[roomAdded.id].tournament.registeredPlayers[pos].name);
        roomsIns[roomAdded.id].tournament.registeredPlayers[pos].chips.should.equal(roomMgr.rooms[roomAdded.id].tournament.registeredPlayers[pos].chips);
      });
      roomsIns[roomAdded.id].tournament.should.have.property('gameCounter', 1);

      roomsIns[roomAdded.id].tournament.currentGame.should.be.an.instanceOf(Game);
      roomsIns[roomAdded.id].tournament.currentGame.pot.should.be.ok;
      roomsIns[roomAdded.id].tournament.currentGame.deck.should.be.an.instanceOf(Deck);
      // flop
      // turn
      // river
      // burnt
      // roundCounter

      // currentRound;
        // positionToAct
        // finalPosition
        // betToCall


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
      allRooms.should.be.an.instanceOf(Array);
      allRooms.should.have.length(2);
    });

  });

});