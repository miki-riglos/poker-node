define(['knockout', 'socket', 'user', 'loadTmpl!room-list'], function(ko, socket, user, roomListTmplId) {

  function RoomListItem(roomDTO) {
    this.id        = roomDTO.id;
    this.host      = roomDTO.host;
    this.started   = roomDTO.started;

    this.tableStatus  = ko.observable(roomDTO.table.status);

    var playersArray = [];
    Object.keys(roomDTO.table.players).forEach(function(key) {
      playersArray.push(roomDTO.table.players[key].name);
    });
    this.tablePlayers = ko.observableArray(playersArray);

    this.tablePlayersList = ko.computed(function() {return this.tablePlayers().join(', ')}, this);
  }

  var roomList = {
    templateId   : roomListTmplId,
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
    roomList.allRooms( rooms.map(function(roomDTO) { return new RoomListItem(roomDTO); }) );
  });

  socket.on('room-added', function(roomAdded) {
    roomList.allRooms.push( new RoomListItem(roomAdded) );
  });

  return roomList;
});