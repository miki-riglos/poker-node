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
  var socket,
      room,
      roomMgr = override.roomMgr;

  before(function(done) {
    server.listen(port, done);
  });

  beforeEach(function(done) {
    socket = getClientSocket();
    roomMgr.add('giovana', function(err, roomAdded) {
      room = roomAdded;
      done();
    });
  });


  // describe('Enter/leave room events', function() {

  //   it('should allow entering and leaving a room', function() {
  //     console.log(io.sockets.clients(room.id));
  //     socket.emit('room-enter', room.id);
  //     console.log(io.sockets.clients(room.id));
  //   });

  // });

  describe('Player registration', function() {

    it('should register in table and notify others', function(done) {
      var otherSocket = getClientSocket(),
          counter     = 0;

      socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
        var registerPlayer = {
          name    : 'miki',
          roomId  : room.id,
          position: 1
        };
        socket.emit('room-register-player', registerPlayer, function(registerPlayerRet) {
          registerPlayerRet.success.should.be.true;
          ++counter;
          if (counter === 2) EmittedAndNotified();
        });

        otherSocket.on('room-registered-player', function(registeredPlayer) {
          registeredPlayer.name.should.equal('miki');
          registeredPlayer.roomId.should.equal(room.id);
          registeredPlayer.position.should.equal(1);
          registeredPlayer.should.have.property('chips');
          ++counter;
          if (counter === 2) EmittedAndNotified();
        });

        function EmittedAndNotified() {
          otherSocket.disconnect();
          done();
        }
      });

    });

  });

  afterEach(function(done) {
    socket.disconnect();
    roomMgr.remove(room.id, done);
  });

  after(function(done) {
    server.close(done);
  });
});