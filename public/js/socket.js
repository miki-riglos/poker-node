define(['io'], function(io) {

  var socket = io.connect();

  socket.on('disconnect', function () { console.log('disconnect'); });
  socket.on('reconnect',  function () { console.log('reconnect'); });

  return socket;
});