define(['knockout', 'socket', 'user', 'loadTmpl!roomlist'], function(ko, socket, user, roomlistTmplId) {

  var roomList = {
    templateId   : roomlistTmplId,
    allRooms     : ko.observableArray([]),
    onlyUserRooms: ko.observable(false),

    add: function() {
      var self = this;
      socket.emit('room-new', user.name(), function(newRoomResp) {
        if (newRoomResp.success) {
          self.allRooms.push(newRoomResp.roomAdded);
        } else {
          //TODO: replace alert
          alert(newRoomResp.message);
        }
      });
    },

    isUserLoggedIn: user.loggedIn
  };

  roomList.roomsToShow = ko.computed(function() {
    if (!roomList.onlyUserRooms()) {
      return roomList.allRooms();
    } else {
      //TODO: filter array
      return roomList.allRooms();
    }
  });

  socket.on('room-list', function(rooms) {
    roomList.allRooms(rooms);
  });

  socket.on('room-added', function(roomAdded) {
    roomList.allRooms.push(roomAdded);
  });

  return roomList;
});