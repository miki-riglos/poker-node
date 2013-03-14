var http    = require('http'),
    express = require('express'),
    app     = express(),
    server  = http.createServer(app),
    io      = require('socket.io').listen(server);

var routesConfig  = require('./routes/config'),
    socketsEvents = require('./sockets/events');

var sessionSettings = {
  secret: 'secret',
  key: 'sid',
  store: new express.session.MemoryStore()
};

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(sessionSettings));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

routesConfig(app);
socketsEvents(io);

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
