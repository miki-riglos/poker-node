define(['knockout', 'socket'], function(ko, socket) {

  var user = {
    name    : ko.observable(''),
    password: ko.observable(''),
    loggedIn: ko.observable(false),

    login: function() {
      var self = this;
      var data = {
        name    : self.name(),
        password: self.password()
      };

      socket.emit('login', data, function(data) {
        if (data.success) {
          self.loggedIn(true);
        } else {
          //TODO: replace alert
          alert(data.message);
        }
      });
    },

    logout: function() {
      var self = this;
      socket.emit('logout', {}, function(data) {
        if (data.success) {
          self.loggedIn(false);
          self.name('');
          self.password('');
        }
      });
    },

  };

  return user;
});