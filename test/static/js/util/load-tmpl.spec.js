define(['require'], function(require) {

  describe('loadTmpl: requirejs plugin for loading external templates', function() {

    it('should return the id of template elem', function(done) {
      require(['loadTmpl!login'], function(loginTmplId) {
        loginTmplId.should.be.ok;
        done();
      });
    });

  });

});