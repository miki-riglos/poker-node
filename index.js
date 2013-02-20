var express = require('express'),
    http    = require('http'),
    app     = express(),
    routes  = require('./routes'),
    server  = http.createServer(app);

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('key-secret'));
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
app.get('/', function(req, res) {
 res.sendfile(__dirname + '/public/index.html') ;
});


server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});