define(function() {

  function Emitter() {
    this._callbacks = {};    
  }
      
  Emitter.prototype.on =  function(event, fn) {
    this._callbacks[event] = this._callbacks[event] || [];
    this._callbacks[event].push(fn);
    
    return this;
  };

  Emitter.prototype.emit = function(event) {
    var args      = [].slice.call(arguments, 1),
        callbacks = this._callbacks[event];
    
    if (callbacks) {
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
    
    return this;
  };
  
  Emitter.prototype.off =  function(event, fn) {
    var callbacks = this._callbacks[event],
        index     = callbacks.indexOf(fn);
        
    if (index != -1) {
      callbacks.splice(index, 1);
    }
    
    return this;  
  };

  return Emitter;
});