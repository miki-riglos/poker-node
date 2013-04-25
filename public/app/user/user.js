define(['knockout', 'socket'], function(ko, socket) {

  var user = {
    name      : ko.observable(''),
    password  : ko.observable(''),
    isLoggedIn: ko.observable(false),

    login: function() {
      var self = this;
      var login = {
        name    : self.name(),
        password: self.password()
      };
      socket.emit('login', login, function(loginRet) {
        if (loginRet.success) {
          self.isLoggedIn(true);
        } else {
          //TODO: replace alert
          alert(loginRet.message);
        }
      });
    },

    logout: function() {
      var self = this;
      socket.emit('logout', {}, function(logoutRet) {
        if (logoutRet.success) {
          self.isLoggedIn(false);
          //Reset values
          self.name('');
          self.password('');
        }
      });
    },
  };

  return user;
});