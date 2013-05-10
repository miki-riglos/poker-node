/*global describe, it, before, beforeEach, afterEach, after*/

var userSocEvents = require('../../sockets/user-events'),
    userMgr       = require('./_setup/events.over').userMgr,
    port          = require('./_setup/port');

var getClientSocket = require('./_setup/get-client-socket');

var server = require('http').createServer(),
    io     = require('socket.io').listen(server);

io.set('log level', 0);

// Config events
userSocEvents(io, userMgr);

describe('User socket events', function() {
  var socket;

  before(function(done) {
    server.listen(port, done);
  });

  beforeEach(function(done) {
    socket = getClientSocket();
    socket.on('connect', done);
  });

  it('should register a new user', function(done) {
    socket.emit('register', {name: 'giovana', password: 'pass'}, function(registerRet) {
      registerRet.success.should.be.true;
      userMgr.users['giovana'].should.be.ok;
      done();
    });
  });
  
  it('should respond to valid login', function(done) {
    var socketId = socket.socket.sessionid;
    socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
      loginRet.success.should.be.true;
      io.sockets.sockets[socketId].get('username', function(err, username) {
        username.should.equal('miki');
        done();      
      });
    });
  });

  it('should respond to invalid login', function(done) {
    socket.emit('login', {name: '', password: ''}, function(loginRet) {
      loginRet.success.should.be.false;
      loginRet.should.have.property('message');
      done();
    });
  });

  it('should respond to logout', function(done) {
    var socketId = socket.socket.sessionid;
    socket.emit('login', {name: 'miki', password: 'pass'}, function(loginRet) {
      socket.emit('logout', {}, function(logoutRet) {
        logoutRet.success.should.be.true;
        io.sockets.sockets[socketId].get('username', function(err, username) {
          username.should.be.empty;
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