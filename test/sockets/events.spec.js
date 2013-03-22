var http    = require('http'),
    server  = http.createServer(),
    io      = require('socket.io').listen(server),
    ioc     = require('../../node_modules/socket.io/node_modules/socket.io-client');

var socketsEvents = require('../../sockets/events');

var port        = process.env.PORT || 3000,
    ioc_options = {'transports': ['websocket'], 'force new connection': true};

io.set("log level", 0);

socketsEvents(io);

describe('Socket events', function() {
  var socket;

  beforeEach(function(done) {
    server.listen(port, function() {
      socket = ioc.connect('http://localhost:' + port, ioc_options);
      done();
    });
  });

  describe('User events', function() {

    it('should respond to valid login', function(done) {
      socket.emit('login', {name: 'miki', password: 'pass'}, function(loginResp) {
        loginResp.success.should.be.true;
        done();
      });
      socket.should.be.an.instanceOf(Object);
    });

    it('should respond to invalid login', function(done) {
      socket.emit('login', {name: '', password: ''}, function(loginResp) {
        loginResp.success.should.be.false;
        loginResp.should.have.property('message');
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
      var targetSocket = ioc.connect('http://localhost:' + port, ioc_options),
          counter      = 0,
          roomAddedInCallback,
          roomAddedInEvent;

      targetSocket.on('room-added', function(roomAddedDn) {
        roomAddedDn.should.be.an.instanceOf(Object);
        roomAddedInEvent = roomAddedDn;
        ++counter;
        if (counter === 2) lastAssert();
      });
      socket.emit('room-new', 'host-is-miki', function(roomAddedDn) {
        roomAddedDn.success.should.be.true;
        roomAddedDn.roomAdded.should.be.an.instanceOf(Object);
        roomAddedInCallback = roomAddedDn.roomAdded;
        ++counter;
        if (counter === 2) lastAssert();
      });

      function lastAssert() {
        roomAddedInCallback.host.should.equal(roomAddedInEvent.host);
        done();
      }
    });

  });

//  afterEach(function(done) {
//    socket.disconnect();
//    server.close(done);
//  });

});