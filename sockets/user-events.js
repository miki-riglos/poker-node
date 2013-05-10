function configUserEvents(io, userMgr) {

  io.sockets.on('connection', function(socket) {

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

  });
}

// Exports
module.exports = configUserEvents;
