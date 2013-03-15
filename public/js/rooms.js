define(['knockout', 'socket', 'table'], function(ko, socket, Table) {

  var rooms = ko.observableArray([]);

  var table1 = Table('host1');
  table1.addPlayer('player1 of table1', 10000);
  table1.addPlayer('player2 of table1', 10000);
  rooms.push(table1);

  var table2 = Table('host2');
  table2.addPlayer('player1 of table2', 10000);
  table2.addPlayer('player2 of table2', 10000);
  rooms.push(table2);

  //TODO
  socket.on('new-room', function(data) {
    rooms.push(Table(data.host));
  });

  return rooms;
});