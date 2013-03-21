require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min'
    }
});

require(['knockout', 'jquery', 'userviews-mgr', 'room-list', 'rooms'], function(ko, $, userViewsMgr, roomList, rooms) {

  ko.applyBindings(userViewsMgr, document.getElementById('userView'));
  ko.applyBindings(rooms, document.getElementById('rooms'));
window.roomList = roomList;
});
