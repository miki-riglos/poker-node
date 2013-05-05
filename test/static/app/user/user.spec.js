/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/user'], function(User) {

  describe('User viewmodel', function() {
    var user;

    beforeEach(function() {
      user = new User();
    });

    it('should login', function(done) {
      user.name('miki');
      user.password('pass');

      user.isLoggedIn.subscribe(function(newValue) {
        user.isLoggedIn().should.be.true;
        done();
      });

      user.login();
    });

    it('should logout', function(done) {
      user.name('miki');
      user.password('pass');
      user.login();

      user.isLoggedIn.subscribe(function(newValue) {
        user.isLoggedIn().should.be.false;
        done();
      });

      user.logout();
    });

  });

});