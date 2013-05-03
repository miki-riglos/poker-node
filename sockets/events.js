var UserManager = require('../infrastructure/user-mgr').UserManager,
    RoomManager = require('../infrastructure/room-mgr').RoomManager;

function events(io, override) {

  override = override || {};

  var userMgr  = override.userMgr || new UserManager(),
      roomMgr  = override.roomMgr || new RoomManager();

  io.sockets.on('connection', function(socket) {

    // User events
    socket.on('login', function(login, fn) {
      if (userMgr.authenticate(login.name, login.password)) {
        // Save name in socket
        socket.set('username', login.name, function() {
          fn({success: true});
        });
      } else {
        fn({success: false, message:'Invalid credentials'});
      }
    });

    socket.on('logout', function(logout, fn) {
      socket.set('username', '', function() {
        fn({success: true});
      });
    });

    socket.on('register', function(register, fn) {
      userMgr.add(register.name, register.password, function(err, newUser) {
        if (err) {
          fn({success: false, message: err.message});
        } else {
          // Save name in socket
          socket.set('username', register.name, function() {
            fn({success: true});
          });
        }
      });
    });

    // Room
    // -- list events
    var allRoomsDTO = roomMgr.getAllRooms();
    socket.emit('room-list', allRoomsDTO);

    socket.on('room-add', function(host, fn) {
      socket.get('username', function(err, username) {
        if (host !== username) {
          fn({success: false, message: 'User is not logged-in user'});
          return;
        }
        roomMgr.add(host, function(err, roomAddedDTO) {
          if (err) {
            fn({success: false, message: err.message});
            return;
          }
          fn({success: true, roomAdded: roomAddedDTO});
          socket.broadcast.emit('room-added', roomAddedDTO);
        });
      });
    });

    socket.on('room-remove', function(remove, fn) {
      socket.get('username', function(err, username) {
        if (remove.host !== username) {
          fn({success: false, message: 'User is not logged-in user'});
          return;
        }
        if (!roomMgr.exist(remove.roomId)) {
          fn({success: false, message: 'Room does not exist anymore'});
          return;
        }
        if (roomMgr.rooms[remove.roomId].host !== username) {
          fn({success: false, message: 'User is not room host'});
          return;
        }
        roomMgr.remove(remove.roomId, function(err, roomRemovedDTO) {
          if (err) {
            fn({success: false, message: err.message});
            return;
          }
          fn({success: true, roomRemovedId: roomRemovedDTO.id});
          socket.broadcast.emit('room-removed', roomRemovedDTO.id);
        });
      });
    });

    // -- Enter/leave events
    socket.on('room-enter', function(roomId, fn) {
      socket.join(roomId);
      fn && fn({success: true});
    });

    socket.on('room-leave', function(roomId, fn) {
      socket.leave(roomId);
      fn && fn({success: true});
    });

    // -- Table events
    socket.on('room-register-player', function(registerPlayer, fn) {
      socket.get('username', function(err, username) {
        if (registerPlayer.name !== username) {
          fn({success: false, message: 'User is not logged-in user'});
          return;
        }
        if (!roomMgr.exist(registerPlayer.roomId)) {
          fn({success: false, message: 'Room does not exist anymore'});
          return;
        }
        var table = roomMgr.rooms[registerPlayer.roomId].table;
        var registerResults = table.registerPlayer(registerPlayer.position, registerPlayer.name);
        fn(registerResults);
        if (registerResults.success) {
          socket.broadcast.emit('room-registered-player', {
            roomId  : registerPlayer.roomId,
            position: registerPlayer.position,
            name    : registerPlayer.name,
            chips   : table.players[registerPlayer.position].chips
          });
        }
      });
    });

  });
}

// Exports
module.exports = events;
