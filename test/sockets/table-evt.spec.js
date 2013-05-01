/*global describe, it, before, beforeEach, afterEach, after*/

var socketsEvents = require('../../sockets/events'),
    override      = require('./setup/events.over'),
    port          = require('./setup/port');

var getClientSocket = require('./setup/get-client-socket');

var server = require('http').createServer(),
    io     = require('socket.io').listen(server);

io.set('log level', 0);

// Config events
socketsEvents(io, override);

describe('Socket events of tables', function() {
  var roomMgr = override.roomMgr,
      socket,
      roomGiova;

  before(function(done) {
    server.listen(port, done);
  });

  beforeEach(function(done) {
    roomMgr.add('giovana', function(err, roomAdded) {
      roomGiova = roomAdded;

      socket = getClientSocket();
      socket.on('connect', done);
    });
  });

  describe('Enter/leave room events', function() {

    it('should allow entering and leaving a room', function(done) {
      var socketId = socket.socket.sessionid;

      socket.emit('room-enter', roomGiova.id, function(roomEnterRet) {
        roomEnterRet.success.should.be.true;
        io.sockets.manager.roomClients[socketId].should.have.property('/' + roomGiova.id);

        socket.emit('room-leave', roomGiova.id, function(roomLeaveRet) {
          roomLeaveRet.success.should.be.true;
          io.sockets.manager.roomClients[socketId].should.not.have.property('/' + roomGiova.id);
          done();
        });
      });
    });

  });

  describe('Player registration', function() {

    it('should register in table and notify others', function(done) {
      var otherSocket = getClientSocket();

      otherSocket.on('connect', function() {
        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          var wasCalled = {callback: false, event: false};
          var registerPlayer = {
            name    : 'miki',
            roomId  : roomGiova.id,
            position: 1
          };

          socket.emit('room-register-player', registerPlayer, function(registerPlayerRet) {
            registerPlayerRet.success.should.be.true;
            calling('callback');
          });

          otherSocket.on('room-registered-player', function(registeredPlayer) {
            registeredPlayer.name.should.equal('miki');
            registeredPlayer.roomId.should.equal(roomGiova.id);
            registeredPlayer.position.should.equal(1);
            registeredPlayer.should.have.property('chips');
            calling('event');
          });

          function calling(who) {
            wasCalled[who] = true;
            if (wasCalled.callback && wasCalled.event) otherSocket.disconnect();
          }
        });
      });

      otherSocket.on('disconnect', function(reason) { done(); });
    });

  });

  afterEach(function(done) {
    socket.on('disconnect', function(reason) { done(); });
    roomMgr.remove(roomGiova.id, function() {
      socket.disconnect();
    });
  });

  after(function(done) {
    server.close(done);
  });
});