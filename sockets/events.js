var UserManager = require('../infrastructure/user-mgr').UserManager,
    RoomManager = require('../infrastructure/room-mgr').RoomManager;

function events(io, override) {

  override = override || {};

  var userMgr  = override.userMgr || new UserManager(),
      roomMgr  = override.roomMgr || new RoomManager();

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
    var allRoomsDTO = roomMgr.getAllRooms();
    socket.emit('room-list', allRoomsDTO);

    socket.on('room-new', function(host, cb) {
      socket.get('username', function(err, username) {
        if (host === username) {
          roomMgr.add(host, function(err, roomAddedDTO) {
            if (err) {
              cb({success: false, message: err.message});
            } else {
              cb({success: true, roomAdded: roomAddedDTO});
              // Notify the others
              socket.broadcast.emit('room-added', roomAddedDTO);
            }
          });
        } else {
         cb({success: false, message: 'Invalid host'});
        }
      });
    });

  });

}

// Exports
module.exports = events;
