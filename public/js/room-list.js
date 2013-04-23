define(['knockout', 'socket', 'user', 'loadTmpl!room-list'], function(ko, socket, user, roomListTmplId) {

  function RoomListItem(roomDTO) {
    this.id        = roomDTO.id;
    this.host      = roomDTO.host;
    this.started   = roomDTO.started;

    this.tournamentStatus  = ko.observable(roomDTO.tournament.status);

    var playersArray = [];
    Object.keys(roomDTO.tournament.players).forEach(function(key) {
      playersArray.push(roomDTO.tournament.players[key].name);
    });
    this.tournamentPlayers = ko.observableArray(playersArray);

    this.tournamentPlayersList = ko.computed(function() {return this.tournamentPlayers().join(', ')}, this);
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