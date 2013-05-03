/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/view-mgr', 'user/user', 'user/registration'], function(userViewMgr, user, registration) {

  describe('user view manager view-model', function() {

    it('should activate login view at start', function() {
      userViewMgr.activeView().should.equal( userViewMgr.views.login );
    });

    afterEach(function(done) {
      if (user.isLoggedIn()) {
        var subscription = user.isLoggedIn.subscribe(function(newValue) {
          subscription.dispose();
          done();
        });
        user.logout();  // reset user, can be re-used
      } else {
        done();
      }
    });

  });

});