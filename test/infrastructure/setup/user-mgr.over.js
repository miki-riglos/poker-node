module.exports = {
  load: function() {
    this.users = {};
  },
  save: function(userTouched, cb) {
    if (cb) cb(null, userTouched.toDTO());
  }
};