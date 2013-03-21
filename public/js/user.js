define(['knockout', 'socket'], function(ko, socket) {

  var user = {
    name    : ko.observable(''),
    password: ko.observable(''),
    loggedIn: ko.observable(false),

    login: function() {
      var self = this;
      var loginData = {
        name    : self.name(),
        password: self.password()
      };
      socket.emit('login', loginData, function(loginResp) {
        if (loginResp.success) {
          self.loggedIn(true);
        } else {
          //TODO: replace alert
          alert(loginResp.message);
        }
      });
    },

    logout: function() {
      var self = this;
      socket.emit('logout', {}, function(logoutResp) {
        if (logoutResp.success) {
          self.loggedIn(false);
          //Reset values
          self.name('');
          self.password('');
        }
      });
    },
  };

  return user;
});