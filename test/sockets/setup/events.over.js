var UserManager = require('../../../infrastructure/user-mgr').UserManager,
    RoomManager = require('../../../infrastructure/room-mgr').RoomManager;

var overrideUserMgr = {
  load: function() {
    this.users = {"miki": {"name": "miki", "password": "pass"} };
  },
  save: function(userTouched, cb) {
    if (cb) cb(null, userTouched.toDTO());
  }
};

var overrideRoomMgr = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, cb) {
    if (cb) cb(null, roomTouched.toDTO());
  }
};

// Exports
module.exports = {
  userMgr: new UserManager(overrideUserMgr),
  roomMgr: new RoomManager(overrideRoomMgr)
};
