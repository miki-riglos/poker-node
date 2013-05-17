define(['knockout', 'socket'], function(ko, socket) {

  function Registration() {
    var self = this;

    self.name      = ko.observable('');
    self.password1 = ko.observable('');
    self.password2 = ko.observable('');

    self.register = function() {
      //TODO: validate data
      var register = {
        name    : self.name(),
        password: self.password1()
      };
      socket.emit('register', register, function(registerRet) {
        if (registerRet.success) {
          self.afterRegister(self.name());
          //Reset values
          self.name('');
          self.password1('');
          self.password2('');
        } else {
          //TODO: replace alert
          alert(registerRet.message);
        }
      });
    };

    self.afterRegister = function() {};
  }

  return Registration;
});