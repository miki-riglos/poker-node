/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/registration'], function(Registration) {

  describe('Registration viewmodel', function() {
    var registration;

    beforeEach(function() {
      registration = new Registration();
    });

    it('should register', function(done) {
      registration.name('giovana');
      registration.password1('pass');
      registration.password2('pass');

      registration.afterRegister = function(name, password) {
        done();
      };

      registration.register();
    });

  });

});