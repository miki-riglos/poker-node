define(['knockout', 'socket', 'user'], function(ko, socket, user) {

  var roomList = {
    allRooms     : ko.observableArray([]),
    onlyUserRooms: ko.observable(false),

//    roomsToShow: ko.computed(function() {
//      if (!this.onlyUserRooms()) {
//        return this.allRooms();
//      } else {
//        //TODO: filter array
//        return this.allRooms();
//      }
//    }),

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