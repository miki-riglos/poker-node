function configRoomEvents(io, roomMgr) {

  io.sockets.on('connection', function(socket) {

    // list events
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

    // enter/leave events
    socket.on('room-enter', function(roomId, fn) {
      socket.join(roomId);
      fn && fn({ success: true, roomEntered: roomMgr.rooms[roomId].toDTO() });
    });

    socket.on('room-leave', function(roomId, fn) {
      socket.leave(roomId);
      fn && fn({success: true});
    });

    // table events
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
module.exports = configRoomEvents;
