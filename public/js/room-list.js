define(['knockout', 'socket', 'user', 'loadTmpl!room-list'], function(ko, socket, user, roomListTmplId) {

  function playersToArray(players) {
    var playersArray = [];
    Object.keys(players).forEach(function(key) {
      playersArray.push(players[key].name);
    });
    return playersArray;
  }

  function formatDate(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return  [months[date.getMonth()], date.getDate()].join(' ')
            + ', ' +
            [('0' + date.getHours()  ).substr(-2),
             ('0' + date.getMinutes()).substr(-2),
             ('0' + date.getSeconds()).substr(-2)].join(':');
  }

  function RoomListItem(roomDTO) {
    var self = this;
    self.id      = roomDTO.id;
    self.host    = roomDTO.host;
    self.started = formatDate(new Date(roomDTO.started));
    self.tableStatus      = ko.observable(roomDTO.table.status);
    self.tablePlayers     = ko.observableArray( playersToArray(roomDTO.table.players) );
    self.tablePlayersList = ko.computed(function() { return self.tablePlayers().join(', '); });

    self.isUserHost = ko.computed(function() { return user.isLoggedIn() && self.host === user.name(); });
  }

  function RoomList() {
    var self = this;
    self.templateId     = roomListTmplId;
    self.allRooms       = ko.observableArray([]);
    self.onlyUserRooms  = ko.observable(false);
    self.isUserLoggedIn = user.isLoggedIn;

    self.roomsToShow = ko.computed(function() {
      if (!self.onlyUserRooms()) {
        return self.allRooms();
      } else {
        return self.allRooms().filter(function(roomListItem) {
          return roomListItem.host === user.name() || roomListItem.tablePlayers().indexOf(user.name()) !== -1 ;
        });
      }
    });

    self.add = function() {
      socket.emit('room-add', user.name(), function(roomAddRet) {
        if (roomAddRet.success) {
          self.allRooms.push( new RoomListItem(roomAddRet.roomAdded) );
        } else {
          //TODO: replace alert
          alert(roomAddRet.message);
        }
      });
    };

    self.remove = function(room) {
      var remove = {
        host  : user.name(),
        roomId: room.id
      };
      socket.emit('room-remove', remove, function(roomRemoveRet) {
        if (roomRemoveRet.success) {
          self.allRooms.remove(room);
        } else {
          //TODO: replace alert
          alert(roomRemoveRet.message);
        }
      });
    };
  }


  var roomList = new RoomList();

  socket.on('room-list', function(rooms) {
    roomList.allRooms( rooms.map(function(room) { return new RoomListItem(room); }) );
  });

  socket.on('room-added', function(roomAdded) {
    roomList.allRooms.push( new RoomListItem(roomAdded) );
  });

  socket.on('room-removed', function(roomRemovedId) {
    var roomRemoved = ko.utils.arrayFirst(roomList.allRooms(), function(room) { return room.id === roomRemovedId; });
    roomList.allRooms.remove(roomRemoved);
  });

  return roomList;
});