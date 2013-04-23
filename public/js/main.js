require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min',
      text    : 'ext/text',
      loadTmpl: 'util/load-tmpl'
    }
});

require(['knockout', 'userviews-mgr', 'room-list', 'rooms'], function(ko, userViewsMgr, roomList, rooms) {

  ko.applyBindings(userViewsMgr, document.getElementById('userView'));
  ko.applyBindings(roomList,     document.getElementById('roomListView'));

  ko.applyBindings(rooms, document.getElementById('rooms'));

});
