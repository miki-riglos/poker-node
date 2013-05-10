var path = require('path');

var express = require('express');

var app = express();

//var sessionSettings = {
//  secret: 'secret',
//  key: 'sid',
//  store: new express.session.MemoryStore()
//};

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(express.cookieParser());
//  app.use(express.session(sessionSettings));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});


// Exports
module.exports = app;