var userMgr = require('../infrastructure/user-mgr').UserManager(),
    roomMgr = require('../infrastructure/room-mgr').RoomManager();

function events(io) {

  io.sockets.on('connection', function (socket) {

    // User events
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

    // Room List events
    socket.emit('room-list', roomMgr.getAllRooms());

    socket.on('room-new', function(host, cb) {
      roomMgr.add(host, function(err, roomAdded) {
        if (err) {
          cb({success: false, message: err.message});
        } else {
          cb({success: true, roomAdded: roomAdded});
          // Notify the others
          socket.broadcast.emit('room-added', roomAdded);
        }
      });
    });

  });

}

// Exports
module.exports = events;
