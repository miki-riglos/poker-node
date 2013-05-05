define(['knockout', 'socket'], function(ko, socket) {

  function User() {
    var self = this;

    self.name       = ko.observable('');
    self.password   = ko.observable('');
    self.isLoggedIn = ko.observable(false);

    self.login = function() {
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
    };

    self.logout = function() {
      socket.emit('logout', {}, function(logoutRet) {
        if (logoutRet.success) {
          self.isLoggedIn(false);
          //Reset values
          self.name('');
          self.password('');
        }
      });
    };
  }

  return User;
});