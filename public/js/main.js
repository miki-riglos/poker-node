require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min'
    }
});

require(['io', 'knockout', 'jquery', 'table'], function(io, ko, $, Table) {
  var socket = io.connect();
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

  var table = Table('miki');
  table.addPlayer('miki', 10000);

  ko.applyBindings(table);
});