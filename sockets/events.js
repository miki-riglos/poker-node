var users = require('../data/users');

function events(io) {

  io.sockets.on('connection', function (socket) {

    socket.on('login', function(data, cb) {
      if (users.authenticate(data.name, data.password)) {
        // Save name in socket
        socket.set('username', name, function() {
          cb({success: true});
        });
      } else {
        cb({success: false, message:'Invalid credentials'});
      }
    });

    socket.on('logout', function(data, cb) {
      socket.set('username', '', function() {
        cb({success: true});
      });
    });

    //TODO
    socket.emit('new-room', {host: 'server'});

  });

}

// Exports
module.exports = events;
