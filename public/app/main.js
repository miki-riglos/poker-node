require.config({
    paths: {
      io      : '/socket.io/socket.io',
      knockout: '../js/knockout-2.2.1',
      jquery  : '../js/jquery-1.9.1.min',
      text    : '../js/text',

      loadTmpl: 'util/load-tmpl'
    }
});

require(['knockout', 'user/view-mgr', 'room/room-list', 'room/room-mgr'], function(ko, UserViewManager, RoomList, RoomManager) {

  var userViewMgr = new UserViewManager(),
      roomList    = new RoomList(userViewMgr.user),
      roomMgr     = new RoomManager(roomList);

  ko.applyBindings(userViewMgr, document.getElementById('userView'));
  ko.applyBindings(roomList, document.getElementById('roomListView'));
  ko.applyBindings(roomMgr, document.getElementById('roomMgrView'));

});
