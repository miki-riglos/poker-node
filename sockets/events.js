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

    socket.on('room-add', function(host, cb) {
      socket.get('username', function(err, username) {
        if (host !== username) {
          cb({success: false, message: 'User is not logged-in user'});
          return;
        }
        roomMgr.add(host, function(err, roomAddedDTO) {
          if (err) {
            cb({success: false, message: err.message});
            return;
          }
          cb({success: true, roomAdded: roomAddedDTO});
          socket.broadcast.emit('room-added', roomAddedDTO);
        });
      });
    });

    socket.on('room-remove', function(remove, cb) {
      socket.get('username', function(err, username) {
        if (remove.host !== username) {
          cb({success: false, message: 'User is not logged-in user'});
          return;
        }
        if (!roomMgr.exist(remove.roomId)) {
          cb({success: false, message: 'Room does not exist anymore'});
          return;
        }
        if (roomMgr.rooms[remove.roomId].host !== username) {
          cb({success: false, message: 'User is not room host'});
          return;
        }
        roomMgr.remove(remove.roomId, function(err, roomRemovedDTO) {
          if (err) {
            cb({success: false, message: err.message});
            return;
          }
          cb({success: true, roomRemovedId: roomRemovedDTO.id});
          socket.broadcast.emit('room-removed', roomRemovedDTO.id);
        });
      });
    });

  });

}

// Exports
module.exports = events;
