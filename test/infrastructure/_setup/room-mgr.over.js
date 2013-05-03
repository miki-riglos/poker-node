module.exports = {
  load: function() {
    this.rooms = {};
  },
  save: function(roomTouched, fn) {
    fn && fn(null, roomTouched.toDTO());
  }
};