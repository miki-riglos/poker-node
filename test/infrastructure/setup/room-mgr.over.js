module.exports = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, cb) {
    if (cb) cb(null, roomTouched.toDTO());
  }
};