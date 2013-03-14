function events(io) {

  io.sockets.on('connection', function (socket) {
    socket.on('login', function(name, cb) {
      // Get player's active tables/tournaments and send it back to the client
      cb( {name: name, tables: []} );
    });
  });

}

// Exports
module.exports = events;
