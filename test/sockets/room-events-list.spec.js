/*global describe, it, before, beforeEach, afterEach, after*/

var userSocEvents = require('../../sockets/user-events'),
    roomSocEvents = require('../../sockets/room-events'),
    userMgr       = require('./_setup/events.over').userMgr,
    roomMgr       = require('./_setup/events.over').roomMgr,
    port          = require('./_setup/port');

var getClientSocket = require('./_setup/get-client-socket');

var server = require('http').createServer(),
    io     = require('socket.io').listen(server);

io.set('log level', 0);

// Config events
userSocEvents(io, userMgr);
roomSocEvents(io, roomMgr);

describe('Room List socket events', function() {
  var socket;

  before(function(done) {
    server.listen(port, done);
  });

  beforeEach(function(done) {
    socket = getClientSocket();
    socket.on('connect', done);
  });

  it('should receive array of rooms', function(done) {
    var otherSocket = getClientSocket();

    otherSocket.on('connect', function() {
      otherSocket.on('room-list', function(rooms) {
        rooms.should.be.an.instanceOf(Array);
        otherSocket.disconnect();
      });
    });

    otherSocket.on('disconnect', function(reason) { done(); });

  });

  describe('Add room', function() {

    it('should add room and notify others', function(done) {
      var otherSocket = getClientSocket();

      otherSocket.on('connect', function() {
        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          var wasCalled = {callback: false, event: false};
          var roomAddedInCallback, roomAddedInEvent;

          socket.emit('room-add', 'miki', function(roomAddRet) {
            roomAddRet.success.should.be.true;
            roomAddedInCallback = roomAddRet.roomAdded;
            calling('callback');
          });

          otherSocket.on('room-added', function(roomAdded) {
            roomAddedInEvent = roomAdded;
            calling('event');
          });

          function calling(who) {
            wasCalled[who] = true;
            if (wasCalled.callback && wasCalled.event) {
              roomAddedInCallback.should.eql(roomAddedInEvent);
              otherSocket.disconnect();
            }
          }
        });
      });

      otherSocket.on('disconnect', function(reason) { done(); });
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
      var otherSocket = getClientSocket();

      otherSocket.on('connect', function() {
        socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
          var wasCalled = {callback: false, event: false};
          var roomRemovedIdInCallback, roomRemovedIdInEvent;

          socket.emit('room-add', 'miki', function(roomAddRet) {
            var remove = {
              host  : 'miki',
              roomId: roomAddRet.roomAdded.id
            };

            socket.emit('room-remove', remove, function(roomRemoveRet) {
              roomRemoveRet.success.should.be.true;
              roomRemoveRet.roomRemovedId.should.be.ok;
              roomRemovedIdInCallback = roomRemoveRet.roomRemovedId;
              calling('callback');
            });

            otherSocket.on('room-removed', function(roomRemovedId) {
              roomRemovedId.should.be.ok;
              roomRemovedIdInEvent = roomRemovedId;
              calling('event');
            });

            function calling(who) {
              wasCalled[who] = true;
              if (wasCalled.callback && wasCalled.event) {
                roomRemovedIdInCallback.should.equal(roomRemovedIdInEvent);
                otherSocket.disconnect();
              }
            }
          });
        });
      });

      otherSocket.on('disconnect', function(reason) { done(); });
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

  afterEach(function(done) {
    socket.on('disconnect', function(reason) { done(); });
    socket.disconnect();
  });

  after(function(done) {
    server.close(done);
  });
});