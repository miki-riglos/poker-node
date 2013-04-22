/*global describe, it, before, beforeEach, afterEach, after*/

define(['require'], function(require) {

  describe('loadTmpl: requirejs plugin for loading external templates', function() {

    it('should return the id of template element', function(done) {
      require(['loadTmpl!login'], function(loginTmplId) {
        loginTmplId.should.be.ok;
        done();
      });
    });

  });

});