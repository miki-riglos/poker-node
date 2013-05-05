define(['knockout', 'socket', 'loadTmpl!room/room-mgr'], function(ko, socket, roomsTmplId) {

  function Player(name, chips) {
    var self = this;
    self.name  = name;
    self.chips = chips;
  }

  function Room() {
    var self = this;
    self.host = ko.observable();
    self.players = ko.observableArray([]);
  }

  function RoomManager() {
    var self = this;
    self.templateId = roomsTmplId;
    self.rooms      = ko.observableArray([]);

    self.enter = function(roomId) {
      //socket room stuff, get data from roomId
      var room = new Room();
      self.rooms.push(room);
    };

    self.leave = function(room) {
      //socket rooom stuff
      self.rooms.remove(room);
    };
  }

  return RoomManager;
});