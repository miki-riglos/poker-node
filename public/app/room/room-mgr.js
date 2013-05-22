define(['knockout', 'underscore', 'socket', 'loadTmpl!room/room-mgr', 'room/format-date'], function(ko, _, socket, roomMgrTmplId, formatDate) {

  function Player(state) {
    var self = this;
    self.name  = ko.observable(state.name);
    self.chips = ko.observable(state.chips);
  }
  
  function Seat(position, playerState) {
    var self = this;
    self.position = position;
    self.player   = new Player(playerState);
  }

  function Room(state, user) {
    var self = this;
    self.user = user;
    
    self.id      = state.id;
    self.host    = state.host;
    self.started = formatDate(new Date(state.started));
    
    self.table = {};
    self.table.status = ko.observable(state.table.status);
    
    self.table.seats = ko.observableArray( 
      _.range(1, 11).map(function(position) { return new Seat(position, state.table.players[position] || {}) })
    );
    
    self.register = function(seat) {
      var registerPlayer = {
        roomId  : self.id,
        position: seat.position,
        name    : self.user.name()
      };      
      socket.emit('room-register-player', registerPlayer, function(registerPlayerRet) {
        if (!registerPlayerRet.success) {   // if success player will be added on 'room-registered-player'
          //TODO: replace alert
          alert(registerPlayerRet.message);          
        }
      });
    };
    
  }

  function RoomManager(roomList) {
    var self = this;
    self.user = roomList.user;
    
    self.templateId = roomMgrTmplId;
    self.rooms      = ko.observableArray([]);

    self.enter = function(roomEntry) {
      socket.emit('room-enter', roomEntry.id, function(roomEnterRet) {
        var room = new Room(roomEnterRet.roomEntered, self.user);
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
    
    socket.on('room-registered-player', function(registeredPlayer) {
      var roomToUpdate = ko.utils.arrayFirst(self.rooms(), function(room) { return room.id === registeredPlayer.roomId; });
      if (roomToUpdate) {
        var seatToUpdate = ko.utils.arrayFirst(roomToUpdate.table.seats(), function(seat) { return seat.position === registeredPlayer.position; });
        seatToUpdate.player.name(registeredPlayer.player.name);
        seatToUpdate.player.chips(registeredPlayer.player.chips);
      }
    });
    
  }

  return RoomManager;
});