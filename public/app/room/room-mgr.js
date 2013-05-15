define(['knockout', 'socket', 'loadTmpl!room/room-mgr', 'room/players-to-array', 'room/format-date'], function(ko, socket, roomsTmplId, playersToArray, formatDate) {

  function Player(state) {
    var self = this;
    self.name  = state.name;
    self.chips = state.chips;
  }

  function Room(state) {
    var self = this;
    
    self.id      = state.id;
    self.host    = state.host;
    self.started = formatDate(new Date(state.started));
    
    self.table = {};
    self.table.status  = ko.observable(state.table.status);
    self.table.players = ko.observableArray( 
      playersToArray(state.table.players).map(function(player) {
        return new Player(state);
      })
    );    
  }

  function RoomManager(roomList) {
    var self = this;
    self.templateId = roomsTmplId;
    self.rooms      = ko.observableArray([]);

    self.enter = function(roomEntry) {
      socket.emit('room-enter', roomEntry.id, function(roomEnterRet) {
        var room = new Room(roomEnterRet.roomEntered);
        self.rooms.push(room);
        room.roomEntry = roomEntry;
        room.roomEntry.hasUserEntered(true);
      });
    };

    self.leave = function(room) {
      socket.emit('room-leave', room.id, function(roomLeaveRet) {
        self.rooms.remove(room);
        room.roomEntry.hasUserEntered(false);
      });
    };
    
    roomList.onEnter = self.enter;
  }

  return RoomManager;
});