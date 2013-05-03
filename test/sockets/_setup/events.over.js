var UserManager = require('../../../infrastructure/user-mgr').UserManager,
    RoomManager = require('../../../infrastructure/room-mgr').RoomManager;

var overrideUserMgr = {
  load: function() {
    this.users = {"miki": {"name": "miki", "password": "pass"} };
  },
  save: function(userTouched, fn) {
    fn && fn(null, userTouched.toDTO());
  }
};

var overrideRoomMgr = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, fn) {
    fn && fn(null, roomTouched.toDTO());
  }
};

// Exports
module.exports = {
  userMgr: new UserManager(overrideUserMgr),
  roomMgr: new RoomManager(overrideRoomMgr)
};
