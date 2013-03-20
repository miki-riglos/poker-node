var UserManager = require('../infrastructure/user-mgr').UserManager;

var userMgr = UserManager();

function events(io) {

  io.sockets.on('connection', function (socket) {

    socket.on('login', function(login, cb) {
      if (userMgr.authenticate(login.name, login.password)) {
        // Save name in socket
        socket.set('username', login.name, function() {
          cb({success: true});
        });
      } else {
        cb({success: false, message:'Invalid credentials'});
      }
    });

    socket.on('logout', function(logout, cb) {
      socket.set('username', '', function() {
        cb({success: true});
      });
    });

    socket.on('register', function(register, cb) {
      userMgr.add(register.name, register.password, function(err, newUser) {
        if (err) {
          cb({success: false, message: err.message});
        } else {
          // Save name in socket
          socket.set('username', register.name, function() {
            cb({success: true});
          });
        }
      });
    });

    //TODO
    socket.emit('new-room', {host: 'server'});

  });

}

// Exports
module.exports = events;
