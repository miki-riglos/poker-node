define(['knockout', 'underscore', 'socket', 'mediator', 'loadTmpl!room/room-mgr', 'room/format-date'], function(ko, _, socket, mediator, roomMgrTmplId, formatDate) {

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

  function RoomManager(user) {
    var self = this;
    self.user = user;
    
    self.templateId = roomMgrTmplId;
    self.rooms      = ko.observableArray([]);

    self.getRoom = function(roomId) {
      return  ko.utils.arrayFirst(self.rooms(), function(room) { return room.id === roomId; });
    };
    
    self.enter = function(roomId) {
      socket.emit('room-enter', roomId, function(roomEnterRet) {
        var room = new Room(roomEnterRet.roomEntered, self.user);
        self.rooms.push(room);
        mediator.emit('room-entered', roomId);
      });
    };

    self.leave = function(room) {
      socket.emit('room-leave', room.id, function(roomLeaveRet) {
        self.rooms.remove(room);
        mediator.emit('room-left', room.id);
      });
    };

    socket.on('room-registered-player', function(registeredPlayer) {
      var roomToUpdate = self.getRoom(registeredPlayer.roomId);
      if (roomToUpdate) {
        var seatToUpdate = ko.utils.arrayFirst(roomToUpdate.table.seats(), function(seat) { return seat.position === registeredPlayer.position; });
        seatToUpdate.player.name(registeredPlayer.player.name);
        seatToUpdate.player.chips(registeredPlayer.player.chips);
      }
    });
    
    mediator.on('room-enter', function(roomId) {
      self.enter(roomId);
    });
    
  }

  return RoomManager;
});