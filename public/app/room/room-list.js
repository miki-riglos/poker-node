define(['knockout', 'socket', 'loadTmpl!room/room-list', 'room/players-to-array', 'room/format-date'], function(ko, socket, roomListTmplId, playersToArray, formatDate) {

  function RoomListItem(roomDTO, user) {
    var self = this;
    self.user = user;

    self.id      = roomDTO.id;
    self.host    = roomDTO.host;
    self.started = formatDate(new Date(roomDTO.started));
    self.tableStatus      = ko.observable(roomDTO.table.status);
    self.tablePlayers     = ko.observableArray( playersToArray(roomDTO.table.players) );
    self.tablePlayersList = ko.computed(function() { return self.tablePlayers().join(', '); });

    self.isUserHost = ko.computed(function() { return self.user.isLoggedIn() && self.host === self.user.name(); });
  }

  function RoomList(user) {
    var self = this;
    self.user = user;

    self.templateId     = roomListTmplId;
    self.allRooms       = ko.observableArray([]);
    self.onlyUserRooms  = ko.observable(false);

    self.roomsToShow = ko.computed(function() {
      if (!self.onlyUserRooms() || !self.user.isLoggedIn()) {
        return self.allRooms();
      } else {
        return self.allRooms().filter(function(roomListItem) {
          return roomListItem.host === self.user.name() || roomListItem.tablePlayers().indexOf(self.user.name()) !== -1 ;
        });
      }
    });

    self.user.isLoggedIn.subscribe(function(userIsLoggedIn) {
      if (!userIsLoggedIn) self.onlyUserRooms(false);
    });

    self.add = function() {
      socket.emit('room-add', self.user.name(), function(roomAddRet) {
        if (roomAddRet.success) {
          self.allRooms.push( new RoomListItem(roomAddRet.roomAdded, self.user) );
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

    self.enter = function(room) {
      self.onEnter(room.id);
    };
    
    self.onEnter = function(roomId) { };
    
    socket.on('room-list', function(rooms) {
      self.allRooms( rooms.map(function(room) { return new RoomListItem(room, self.user); }) );
    });

    socket.on('room-added', function(roomAdded) {
      self.allRooms.push( new RoomListItem(roomAdded, self.user) );
    });

    socket.on('room-removed', function(roomRemovedId) {
      var roomRemoved = ko.utils.arrayFirst(self.allRooms(), function(room) { return room.id === roomRemovedId; });
      self.allRooms.remove(roomRemoved);
    });
  }

  return RoomList;
});