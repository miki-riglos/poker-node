var path = require('path');

var UserManager = require('../infrastructure/user-mgr').UserManager;

var userMgr = UserManager();

function config(app) {

  // GET home
  app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../public/index.html')) ;
  });

  // POST login
  app.post('/login', function(req, res){
    if (userMgr.authenticate(req.body.username, req.body.password)) {
      req.session.regenerate(function() {
        req.session.user = req.body.username;
        res.send( {success: true} );
      });
    } else {
      res.send( {success: false, message: 'Invalid credentials'} );
    }
  });

  // POST logout
  app.get('/logout', function(req, res){
    // destroy the user's session to log them out
    req.session.destroy(function(){
      res.send( {success: true} );
    });
  });

}

// Exports
module.exports = config;
