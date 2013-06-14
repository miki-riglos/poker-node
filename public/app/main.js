require.config({
    paths: {
      io        : '/socket.io/socket.io',
      knockout  : '../js/knockout-2.2.1',
      underscore: '../js/underscore-min',
      jquery    : '../js/jquery-1.9.1.min',
      text      : '../js/text',

      loadTmpl  : 'util/load-tmpl'
    },
    
    shim: {
      underscore: {exports: '_'}
    }
});

require(['knockout', 'user/user', 'user/registration', 'user/view-mgr', 'room/room-list', 'room/room-mgr'], function(ko, User, Registration, UserViewManager, RoomList, RoomManager) {

  var user         = new User(),
      registration = new Registration();
  
  var userViewMgr = new UserViewManager(user, registration),
      roomList    = new RoomList(user),
      roomMgr     = new RoomManager(user);

  ko.applyBindings(userViewMgr, document.getElementById('userView'));
  ko.applyBindings(roomList, document.getElementById('roomListView'));
  ko.applyBindings(roomMgr, document.getElementById('roomMgrView'));

});
