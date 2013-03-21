define(['knockout', 'socket'], function(ko, socket) {

  var registration = {
    name      : ko.observable(''),
    password1 : ko.observable(''),
    password2 : ko.observable(''),

    register: function() {
      var self = this;
      //TODO: validate data
      var registerData = {
        name    : self.name(),
        password: self.password1()
      };
      socket.emit('register', registerData, function(registerResp) {
        if (registerResp.success) {
          self.afterRegister(self.name(), self.password1());
          //Reset values
          self.name('');
          self.password1('');
          self.password2('');
        } else {
          //TODO: replace alert
          alert(registerResp.message);
        }
      });
    },

    afterRegister: function() {}
  };

  return registration;
});