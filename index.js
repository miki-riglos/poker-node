var http = require('http');

var web       = require('./web'),
    socketIO  = require('socket.io');
    
var UserManager = require('./infrastructure/user-mgr').UserManager,
    RoomManager = require('./infrastructure/room-mgr').RoomManager;
    
var userWebRoutes = require('./web/user-routes'),
    userSocEvents = require('./sockets/user-events'),
    roomSocEvents = require('./sockets/room-events');

web.set('port', process.env.PORT || 3000);

var app = {
  server: http.createServer(),
  web   : web,
  
  io: null,
  
  userMgr: null,
  roomMgr: null,
  
  start: function() {
    this.userMgr = this.userMgr || new UserManager();
    this.roomMgr = this.roomMgr || new RoomManager();
    
    this.server.on('request', this.web);
    userWebRoutes(this.web, this.userMgr);
    
    this.io = this.io || socketIO.listen(this.server);
    userSocEvents(this.io, this.userMgr);
    roomSocEvents(this.io, this.roomMgr);
    
    this.server.listen(this.web.get('port'), function() {
      console.log("Express server listening on port " + web.get('port'));
    });
  }
};

if (!module.parent) {
  app.start();
}


// Exports
module.exports = app;
