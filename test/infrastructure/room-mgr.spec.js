var Room        = require('../../infrastructure/room-mgr').Room,
    RoomManager = require('../../infrastructure/room-mgr').RoomManager;

var Tournament = require('../../poker/tournament').Tournament,
    Player     = require('../../poker/player').Player,
    Game       = require('../../poker/game').Game,
    Deck       = require('../../poker/deck').Deck,
    Card       = require('../../poker/deck').Card,
    Round      = require('../../poker/round').Round;

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

  describe('deserialization', function() {
    var roomsStr, roomsIns;
    var expectedTournament, actualTournament;


    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        actualTournament = roomMgr.rooms[roomAdded.id].tournament;
        done();
      });
    });

    it('should deserialize rooms', function() {
      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      var expectedRoom = roomsIns[roomAdded.id];

      expectedRoom.should.be.an.instanceOf(Room);
      expectedRoom.host.should.equal(roomAdded.host);
      expectedRoom.started.should.equal(roomAdded.started);

      expectedRoom.tournament.should.be.an.instanceOf(Tournament);
      expectedRoom.tournament.should.have.property('status', 'open');
      expectedRoom.tournament.should.have.property('button', null);
      expectedRoom.tournament.registeredPlayers.should.eql({});  //deepEqual
      expectedRoom.tournament.should.have.property('gameCounter', 0);
      expectedRoom.tournament.should.have.property('currentGame', null);
    });

    it('should deserialize rooms with ongoing tournaments', function() {
      actualTournament.registerPlayer(1, 'Miki');
      actualTournament.registerPlayer(2, 'Giovana');
      actualTournament.registerPlayer(3, 'Sofia');
      actualTournament.registerPlayer(4, 'Bianca');
      actualTournament.start();

      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      expectedTournament = roomsIns[roomAdded.id].tournament;

      expectedTournament.should.be.an.instanceOf(Tournament);
      expectedTournament.should.have.property('status', 'start');
      expectedTournament.should.have.property('button');
      expectedTournament.button.should.be.ok;
      [1, 2, 3, 4].forEach(function(pos) {
        expectedTournament.registeredPlayers[pos].should.be.an.instanceOf(Player);
        expectedTournament.registeredPlayers[pos].name.should.equal(actualTournament.registeredPlayers[pos].name);
        expectedTournament.registeredPlayers[pos].chips.should.equal(actualTournament.registeredPlayers[pos].chips);
        // Methods for actions
        ['raises', 'calls', 'checks', 'folds'].forEach(function(method) {
          expectedTournament.registeredPlayers[pos].should.have.property(method);
        });
      });
      expectedTournament.should.have.property('gameCounter', 1);

      expectedTournament.currentGame.should.be.an.instanceOf(Game);
      expectedTournament.currentGame.pot.should.be.ok;
      expectedTournament.currentGame.deck.should.be.an.instanceOf(Deck);
      expectedTournament.currentGame.should.have.property('roundCounter', 1);

      expectedTournament.currentGame.should.have.property('gamePlayers');
      [1, 2, 3, 4].forEach(function(pos) {
        expectedTournament.currentGame.gamePlayers[pos].hand.should.be.an.instanceOf(Array);
        expectedTournament.currentGame.gamePlayers[pos].should.have.property('totalBet', 0);
        expectedTournament.currentGame.gamePlayers[pos].should.have.property('folded', false);
      });

      expectedTournament.currentGame.currentRound.should.be.an.instanceOf(Round);
      expectedTournament.currentGame.currentRound.should.have.property('number', 1);
      expectedTournament.currentGame.currentRound.should.have.property('positionToAct', null);
      expectedTournament.currentGame.currentRound.should.have.property('finalPosition', null);
      expectedTournament.currentGame.currentRound.should.have.property('betToCall', null);
    });

    it('should deserialize rooms with ongoing tournaments at the end of 1st game', function() {
      var positionToAct;
      actualTournament.registerPlayer(1, 'Miki');
      actualTournament.registerPlayer(2, 'Giovana');
      actualTournament.registerPlayer(3, 'Sofia');
      actualTournament.registerPlayer(4, 'Bianca');
      actualTournament.start();
      // preflop
      [1, 2, 3].forEach(function() {
        positionToAct = actualTournament.currentGame.currentRound.positionToAct;
        actualTournament.currentGame.currentRound.call(positionToAct);
      });
      positionToAct = actualTournament.currentGame.currentRound.positionToAct;
      actualTournament.currentGame.currentRound.check(positionToAct);

      // Advance until the of end first game
      // *** need to use tournament events (process.nextTick)

      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      expectedTournament = roomsIns[roomAdded.id].tournament;

      expectedTournament.currentGame.currentRound.should.be.an.instanceOf(Round);
      // flop
      // turn
      // river

      // roundPlayers: actions, bets
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
