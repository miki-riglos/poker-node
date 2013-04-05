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
    var expectedRoom, expectedTournament, expectedRegisteredPlayers,
        actualRoom  , actualTournament  , actualRegisteredPlayers  ;

    beforeEach(function(done) {
      roomMgr.add('giovana', function(err, firstRoomAdded) {
        roomAdded = firstRoomAdded;
        expectedTournament = roomMgr.rooms[roomAdded.id].tournament;
        done();
      });
    });

    function assignExpectedActualVars() {
      expectedRoom              = roomMgr.rooms[roomAdded.id];
      expectedTournament        = roomMgr.rooms[roomAdded.id].tournament;
      expectedRegisteredPlayers = roomMgr.rooms[roomAdded.id].tournament.registeredPlayers;

      roomsStr = roomMgr.serialize(roomMgr.rooms);
      roomsIns = roomMgr.deserialize(roomsStr);

      actualRoom              = roomsIns[roomAdded.id];
      actualTournament        = roomsIns[roomAdded.id].tournament;
      actualRegisteredPlayers = roomsIns[roomAdded.id].tournament.registeredPlayers;
    }

    function getPositionToAct() {
      return expectedTournament.currentGame.currentRound.positionToAct;
    }

    it('should deserialize rooms', function() {
      assignExpectedActualVars();
      actualRoom.should.eql(expectedRoom); // deepEqual
    });

    it('should deserialize rooms with ongoing tournaments', function(done) {
      expectedTournament.registerPlayer(1, 'Miki');
      expectedTournament.registerPlayer(2, 'Giovana');
      expectedTournament.registerPlayer(3, 'Sofia');
      expectedTournament.registerPlayer(4, 'Bianca');

      // events fire sequentially (flow.spec.js)
      expectedTournament.on('tournament-start', function() {
        assignExpectedActualVars();
        actualTournament.should.be.an.instanceOf(Tournament);
        actualTournament.should.have.property('status', expectedTournament.status);
        [1, 2, 3, 4].forEach(function(position) {
          actualRegisteredPlayers[position].should.be.an.instanceOf(Player);
          actualRegisteredPlayers[position].should.have.property('name' , expectedRegisteredPlayers[position].name);
          actualRegisteredPlayers[position].should.have.property('chips', expectedRegisteredPlayers[position].chips);
          // Methods for actions
          ['raises', 'calls', 'checks', 'folds'].forEach(function(method) {
            actualRegisteredPlayers[position].should.have.property(method);
          });
        });
        actualTournament.should.have.property('gameCounter', actualTournament.gameCounter);
      });

      expectedTournament.on('tournament-button', function() {
        assignExpectedActualVars();
        actualTournament.should.have.property('button', expectedTournament.button);
      });

      expectedTournament.once('game-start', function() {
        assignExpectedActualVars();

        actualTournament.should.have.property('gameCounter', expectedTournament.gameCounter);

        actualTournament.currentGame.should.be.an.instanceOf(Game);
        actualTournament.currentGame.should.have.property('pot', expectedTournament.currentGame.pot);
        actualTournament.currentGame.deck.should.be.an.instanceOf(Deck);
        actualTournament.currentGame.should.have.property('roundCounter', expectedTournament.currentGame.roundCounter);
        actualTournament.currentGame.gamePlayers.should.eql( expectedTournament.currentGame.gamePlayers );
      });

      expectedTournament.once('round-start', function() {
        assignExpectedActualVars();

        actualTournament.currentGame.should.have.property('roundCounter', expectedTournament.currentGame.roundCounter);

        actualTournament.currentGame.currentRound.should.be.an.instanceOf(Round);
        actualTournament.currentGame.currentRound.should.have.property('number', expectedTournament.currentGame.currentRound.number);
        actualTournament.currentGame.currentRound.should.have.property('positionToAct', expectedTournament.currentGame.currentRound.positionToAct);
        actualTournament.currentGame.currentRound.should.have.property('finalPosition', expectedTournament.currentGame.currentRound.finalPosition);
        actualTournament.currentGame.currentRound.should.have.property('betToCall', expectedTournament.currentGame.currentRound.betToCall);
      });

      expectedTournament.once('game-end', function() {
        assignExpectedActualVars();

        actualTournament.should.have.property('gameCounter', expectedTournament.gameCounter);
actualTournament.currentGame.toInspect('currentGame');
actualTournament.currentGame.currentRound.toInspect('currentRound');
      // assert:
      //  - flop
      //  - turn
      //  - river
      //  - roundPlayers: actions, bets

        done();
      });

      expectedTournament.start();
      // events up to round-start were fired, blinds are placed
      expectedTournament.currentGame.currentRound.call( getPositionToAct() );
      expectedTournament.currentGame.currentRound.call( getPositionToAct() );
      expectedTournament.currentGame.currentRound.call( getPositionToAct() );
      expectedTournament.currentGame.currentRound.check( getPositionToAct() );
      // preflop finish
      expectedTournament.currentGame.currentRound.check( getPositionToAct() );
      expectedTournament.currentGame.currentRound.check( getPositionToAct() );
      expectedTournament.currentGame.currentRound.check( getPositionToAct() );
      expectedTournament.currentGame.currentRound.check( getPositionToAct() );
      // flop finish
      expectedTournament.currentGame.currentRound.raise( getPositionToAct(), 25 );
      expectedTournament.currentGame.currentRound.fold( getPositionToAct() );
      expectedTournament.currentGame.currentRound.fold( getPositionToAct() );
      expectedTournament.currentGame.currentRound.fold( getPositionToAct() );
      // game finish
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
