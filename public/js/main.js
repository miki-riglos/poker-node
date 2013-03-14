require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min'
    }
});

require(['io', 'knockout', 'jquery', 'table'], function(io, ko, $, Table) {
  //var socket = io.connect();

  var playerInfo = {
    name    : ko.observable(''),
    message : ko.observable(''),
    loggedIn: ko.observable(false),

    login: function() {
      var self = this;
      $.ajax({
        type: 'POST',
        url : '/login',
        data: {username: self.name(), password: 'pass'}
      }).done(function(res) {
        if (res.success) {
          self.loggedIn(true);
          self.message('');
        } else {
          self.loggedIn(false);
          self.message(res.message);
          setTimeout(function() {
            self.message('');
          }, 2000);
        }
      });
    },

    logout: function() {
      var self = this;
      $.ajax({
        type: 'GET',
        url : '/logout',
      }).done(function(res) {
        self.name('');
        self.loggedIn(!res.success);
      });
    },

//    io_login: function() {
//      var self = this;
//      socket.emit('login', self.name(), function(data) {
//        self.loggedIn(true);
//        console.log(data);
//      });
//    },

    tables: ko.observableArray([])
  };

  var table1 = Table('host1');
  table1.addPlayer('player1 of table1', 10000);
  table1.addPlayer('player2 of table1', 10000);
  playerInfo.tables.push(table1);

  var table2 = Table('host2');
  table2.addPlayer('player1 of table2', 10000);
  table2.addPlayer('player2 of table2', 10000);
  playerInfo.tables.push(table2);

  ko.applyBindings(playerInfo);
});
