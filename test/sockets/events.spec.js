/*global describe, it, before, beforeEach, afterEach, after*/

var http    = require('http'),
    server  = http.createServer(),
    io      = require('socket.io').listen(server),
    ioc     = require('../../node_modules/socket.io/node_modules/socket.io-client');

var socketsEvents = require('../../sockets/events');

var UserManager = require('../../infrastructure/user-mgr').UserManager,
    RoomManager = require('../../infrastructure/room-mgr').RoomManager;

var host       = process.env.IP || 'localhost',
    port       = process.env.PORT || 3000,
    serverURI  = 'http://' + host + ':' + port,
    clientOpts = {'transports': ['websocket'], 'force new connection': true};

// Override load and save methods for UserManager
var overrideUserMgr = {
  load: function() {
    this.users = {"miki": {"name": "miki", "password": "pass"} };
  },
  save: function(userTouched, cb) {
    if (cb) cb(null, userTouched.toDTO());
  }
};

var overrideRoomMgr = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, cb) {
    if (cb) cb(null, roomTouched.toDTO());
  }
};

var override = {
  userMgr: new UserManager(overrideUserMgr),
  roomMgr: new RoomManager(overrideRoomMgr)
};

io.set("log level", 0);

// Config events
socketsEvents(io, override);

describe('Socket events', function() {
  var socket;

  before(function(done) {
    server.listen(port, done);
  });

  beforeEach(function() {
    socket = ioc.connect(serverURI, clientOpts);
  });

  describe('User events', function() {

    it('should respond to valid login', function(done) {
      socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
        loginRet.success.should.be.true;
        done();
      });
    });

    it('should respond to invalid login', function(done) {
      socket.emit('login', {name: '', password: ''}, function(loginRet) {
        loginRet.success.should.be.false;
        loginRet.should.have.property('message');
        done();
      });
    });

  });

  describe('Room List events', function() {

    it('should receive array of rooms', function(done) {
      socket.on('room-list', function(rooms) {
        rooms.should.be.an.instanceOf(Array);
        done();
      });
    });

    describe('Add room', function() {

      it('should add room and notify others', function(done) {
        var otherSocket = ioc.connect(serverURI, clientOpts),
            counter     = 0,
            roomAddedInCallback,
            roomAddedInEvent;

        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          socket.emit('room-add', 'miki', function(roomAddRet) {
            roomAddRet.success.should.be.true;
            roomAddRet.roomAdded.should.be.an.instanceOf(Object);
            roomAddedInCallback = roomAddRet.roomAdded;
            ++counter;
            if (counter === 2) EmittedAndNotified();
          });

          otherSocket.on('room-added', function(roomAdded) {
            roomAdded.should.be.an.instanceOf(Object);
            roomAddedInEvent = roomAdded;
            ++counter;
            if (counter === 2) EmittedAndNotified();
          });

          function EmittedAndNotified() {
            roomAddedInCallback.host.should.equal(roomAddedInEvent.host);
            otherSocket.disconnect();
            done();
          }
        });
      });

      it('should not add room when host is not equal to player name', function(done) {
        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          socket.emit('room-add', 'another', function(roomAddRet) {
            roomAddRet.success.should.be.false;
            roomAddRet.should.have.property('message');
            done();
          });
        });
      });

    });

    describe('Remove room', function() {

      it('should remove room and notify others', function(done) {
        var otherSocket = ioc.connect(serverURI, clientOpts),
            counter     = 0,
            roomRemovedIdInCallback,
            roomRemovedIdInEvent;

        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          socket.emit('room-add', 'miki', function(roomAddRet) {
            var remove = {
              host  : 'miki',
              roomId: roomAddRet.roomAdded.id
            };
            socket.emit('room-remove', remove, function(roomRemoveRet) {
              roomRemoveRet.success.should.be.true;
              roomRemoveRet.roomRemovedId.should.be.ok;
              roomRemovedIdInCallback = roomRemoveRet.roomRemovedId;
              ++counter;
              if (counter === 2) EmittedAndNotified();
            });
          });
        });

        otherSocket.on('room-removed', function(roomRemovedId) {
          roomRemovedId.should.be.ok;
          roomRemovedIdInEvent = roomRemovedId;
          ++counter;
          if (counter === 2) EmittedAndNotified();
        });

        function EmittedAndNotified() {
          roomRemovedIdInCallback.should.equal(roomRemovedIdInEvent);
          otherSocket.disconnect();
          done();
        }
      });

      it('should not remove room when host is not equal to player name', function(done) {
        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          socket.emit('room-remove', 'another', function(roomRemoveRet) {
            roomRemoveRet.success.should.be.false;
            roomRemoveRet.should.have.property('message');
            done();
          });
        });
      });

    });

  });

  afterEach(function() {
    socket.disconnect();
  });

  after(function(done) {
    server.close(done);
  });
});