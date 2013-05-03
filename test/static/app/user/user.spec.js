/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/user'], function(user) {

  describe('user view model', function() {

    it('should login', function(done) {
      user.name('miki');
      user.password('pass');

      var subscription = user.isLoggedIn.subscribe(function(newValue) {
        user.isLoggedIn().should.be.true;
        subscription.dispose();
        user.logout();  // reset user, can be re-used later (singleton)
        done();
      });

      user.login();
    });

  });

});