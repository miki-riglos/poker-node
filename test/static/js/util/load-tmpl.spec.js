define(['require'], function(require) {

  describe('loadTmpl: requirejs plugin for loading external templates', function() {

    it('should return the id of template elem', function() {
      require(['loadTmpl!../tmpl/login'], function(loginTmplId) {
        loginTmplId.should.be.ok;
        console.log(loginTmplId);
      });
    });

  });

});