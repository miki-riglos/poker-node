require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min'
    }
});

require(['knockout', 'jquery', 'user', 'rooms'], function(ko, $, user, rooms) {

  ko.applyBindings(user, document.getElementById('user'));
  ko.applyBindings(rooms, document.getElementById('rooms'));

});
