/*global describe, it, before, beforeEach, afterEach, after*/

define(['util/emitter'], function(Emitter) {

  describe('Emitter class', function() {
    var instance;

    beforeEach(function() {
      instance = new Emitter();
    });

    it('should emit events', function(done) {
      instance.on('event', done);
      instance.emit('event');
    });

    it('should remove callbacks', function() {
      var callback = function() {};

      instance.on('event', callback);
      instance.emit('event');
      
      instance.off('event', callback);
      
      instance._callbacks['event'].should.be.empty;
    });
    
  });

});