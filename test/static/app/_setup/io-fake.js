define(function() {

  var socket = {

    _callbacks: {},

    on: function(event, fn) {
      this._callbacks[event] = this._callbacks[event] || [];
      this._callbacks[event].push(fn);
      return this;
    },

    emit: function(event) {
      var args      = [].slice.call(arguments, 1),
          callbacks = this._callbacks[event];
      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }
      return this;
    }
  };

  var users = {
    'miki': {
      name    : 'miki',
      password: 'pass'
    }
  };

  function delay(fn) {
    window.setTimeout(fn, 100);
  }

  socket.on('login', function(login, fn) {
    if (users[login.name] && users[login.name].password === login.password) {
      delay(fn({success: true}));
    } else {
      delay(fn({success: false, message:'Invalid credentials'}));
    }
  });

  socket.on('logout', function(logout, fn) { delay(fn({success: true})); });

  socket.on('register', function(register, fn) { delay(fn({success: true})); });

  socket.on('room-add', function(name, fn) {
    delay(fn({
      success: true,
      roomAdded: {
        id     : name + Date.now(),
        host   : name,
        started: Date.now(),
        table  : {
          status : 'open',
          players: []
        }
      }
    }));
  });
  socket.on('room-remove', function(remove, fn) { delay(fn({success: true})); });


  return {
    connect: function() {
      return socket;
    }
  };

});