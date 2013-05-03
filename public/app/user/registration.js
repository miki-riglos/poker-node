define(['knockout', 'socket'], function(ko, socket) {

  var registration = {
    name      : ko.observable(''),
    password1 : ko.observable(''),
    password2 : ko.observable(''),

    register: function() {
      var self = this;
      //TODO: validate data
      var register = {
        name    : self.name(),
        password: self.password1()
      };
      socket.emit('register', register, function(registerRet) {
        if (registerRet.success) {
          self.afterRegister(self.name(), self.password1());
          //Reset values
          self.name('');
          self.password1('');
          self.password2('');
        } else {
          //TODO: replace alert
          alert(registerRet.message);
        }
      });
    },

    afterRegister: function() {}
  };

  return registration;
});