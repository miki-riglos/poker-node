define(['knockout', 'socket'], function(ko, socket) {

  var registration = {
    name      : ko.observable(''),
    password1 : ko.observable(''),
    password2 : ko.observable(''),
    inProgress: ko.observable(false),

    user: {}, //it must be overwritten with parent viewmodel

    start: function() {
      this.inProgress(true);
    },

    register: function() {
      var self = this;
      //Validate data
      var registerData = {
        name    : self.name(),
        password: self.password1()
      };
      socket.emit('register', registerData, function(registerResp) {
        if (registerResp.success) {
          //Update user viewmodel
          self.user.name(self.name());
          self.user.password(self.password1());
          self.user.loggedIn(true);
          //end registration
          self.end();
        } else {
          //TODO: replace alert
          alert(registerResp.message);
        }
      });
    },

    end: function() {
      this.inProgress(false);
      //Reset values
      this.name('');
      this.password1('');
      this.password2('');
    }
  };

  return registration;
});