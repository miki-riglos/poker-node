var http    = require('http'),
    server  = http.createServer(),
    io      = require('socket.io').listen(server),
    ioc     = require('../../node_modules/socket.io/node_modules/socket.io-client');

var socketsEvents = require('../../sockets/events');

var UserManager = require('../../infrastructure/user-mgr').UserManager,
    RoomManager = require('../../infrastructure/room-mgr').RoomManager;

var host        = process.env.IP || 'localhost',
    port        = process.env.PORT || 3000,
    ioc_options = {'transports': ['websocket'], 'force new connection': true};

// Override load and save methods for UserManager
var overrideUserMgr = {
  load: function() {
    this.users = {"miki": {"name": "miki", "password": "pass"} };
  },
  save: function(userTouched, cb) {
    if (cb) cb(null, userTouched);
  }
};

var overrideRoomMgr = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, cb) {
    if (cb) cb(null, roomTouched);
  }
};

var override = {
  userMgr: UserManager(overrideUserMgr),
  roomMgr: RoomManager(overrideRoomMgr),
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
    socket = ioc.connect('http://' + host + ':' + port, ioc_options);
  });

  describe('User events', function() {

    it('should respond to valid login', function(done) {
      socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
        loginRet.success.should.be.true;
    socket.disconnect();
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
      socket.on('room-list', function(roomListDn) {
        roomListDn.should.be.an.instanceOf(Array);
        done();
      });
    });

    it('should respond to new room and notify others', function(done) {
      var targetSocket = ioc.connect('http://' + host + ':' + port, ioc_options),
          counter      = 0,
          roomAddedInCallback,
          roomAddedInEvent;

      socket.emit('room-new', 'host-name', function(roomNewRet) {
        roomNewRet.success.should.be.true;
        roomNewRet.roomAdded.should.be.an.instanceOf(Object);
        roomAddedInCallback = roomNewRet.roomAdded;
        ++counter;
        if (counter === 2) EmittedAndNotified();
      });

      targetSocket.on('room-added', function(roomAdded) {
        roomAdded.should.be.an.instanceOf(Object);
        roomAddedInEvent = roomAdded;
        ++counter;
        if (counter === 2) EmittedAndNotified();
      });

      function EmittedAndNotified() {
        roomAddedInCallback.host.should.equal(roomAddedInEvent.host);
        targetSocket.disconnect();
        done();
      }
    });

  });

  afterEach(function() {
    socket.disconnect();
  });

  after(function(done) {
    server.close(done);
  });
});