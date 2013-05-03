module.exports = {
  load: function() {
    this.users = {};
  },
  save: function(userTouched, fn) {
    fn && fn(null, userTouched.toDTO());
  }
};