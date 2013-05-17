define(['knockout', 'underscore', 'socket', 'loadTmpl!room/room-list', 'room/format-date'], function(ko, _, socket, roomListTmplId, formatDate) {

  function RoomEntry(roomDTO, user) {
    var self = this;
    self.user = user;

    self.id      = roomDTO.id;
    self.host    = roomDTO.host;
    self.started = formatDate(new Date(roomDTO.started));
    
    self.table = {};
    self.table.status      = ko.observable(roomDTO.table.status);
    self.table.players     = ko.observableArray(_.pluck(roomDTO.table.players, 'name')); // array of player names
    self.table.playersList = ko.computed(function() { return self.table.players().join(', '); });
    
    self.hasUserEntered = ko.observable(false);
    self.isUserHost     = ko.computed(function() { return self.user.isLoggedIn() && self.host === self.user.name(); });
  }

  function RoomList(user) {
    var self = this;
    self.user = user;

    self.templateId    = roomListTmplId;
    self.allRooms      = ko.observableArray([]);
    self.onlyUserRooms = ko.observable(false);

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
          self.allRooms.push( new RoomEntry(roomAddRet.roomAdded, self.user) );
        } else {
          //TODO: replace alert
          alert(roomAddRet.message);
        }
      });
    };

    self.remove = function(roomEntry) {
      var remove = {
        host  : user.name(),
        roomId: roomEntry.id
      };
      socket.emit('room-remove', remove, function(roomRemoveRet) {
        if (roomRemoveRet.success) {
          self.allRooms.remove(roomEntry);
        } else {
          //TODO: replace alert
          alert(roomRemoveRet.message);
        }
      });
    };

    self.enter = function(roomEntry) {
      self.onEnter(roomEntry);
    };
    
    self.onEnter = function(roomEntry) { };
    
    socket.on('room-list', function(rooms) {
      self.allRooms( rooms.map(function(room) { return new RoomEntry(room, self.user); }) );
    });

    socket.on('room-added', function(roomAdded) {
      self.allRooms.push( new RoomEntry(roomAdded, self.user) );
    });

    socket.on('room-removed', function(roomRemovedId) {
      var roomRemoved = ko.utils.arrayFirst(self.allRooms(), function(room) { return room.id === roomRemovedId; });
      self.allRooms.remove(roomRemoved);
    });
    
    socket.on('room-registered-player', function(registeredPlayer) {
      var roomToUpdate = ko.utils.arrayFirst(self.allRooms(), function(room) { return room.id === registeredPlayer.roomId; });
      roomToUpdate.table.players.push( registeredPlayer.player.name );
    });
    
  }

  return RoomList;
});