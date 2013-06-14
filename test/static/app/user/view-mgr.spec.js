/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/view-mgr', 'user/user', 'user/registration'], function(UserViewManager, User, Registration) {

  describe('UserViewManager viewmodel', function() {
    var userViewMgr;

    beforeEach(function() {
      userViewMgr = new UserViewManager(new User(), new Registration());
    });

    it('should activate login view at start', function() {
      userViewMgr.activeView().should.equal( userViewMgr.views.login );
    });

    it('should activate loggedIn view after login', function() {
      userViewMgr.user.isLoggedIn(true);
      userViewMgr.activeView().should.equal( userViewMgr.views.loggedIn );
      userViewMgr.user.isLoggedIn(false);
      userViewMgr.activeView().should.equal( userViewMgr.views.login );
    });

    it('should activate login view after logout', function() {
      userViewMgr.user.isLoggedIn(true);
      userViewMgr.user.isLoggedIn(false);
      userViewMgr.activeView().should.equal( userViewMgr.views.login );
    });

    it('should auto-login after register', function(done) {
      userViewMgr.registration.name('giovana');
      userViewMgr.registration.password1('pass');
      userViewMgr.registration.password2('pass');

      userViewMgr.user.isLoggedIn.subscribe(function(newValue) {
        userViewMgr.user.isLoggedIn().should.be.true;
        done();
      });

      userViewMgr.registration.register();
    });

  });

});