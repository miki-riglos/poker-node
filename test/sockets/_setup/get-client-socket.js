var io = require('../../../node_modules/socket.io/node_modules/socket.io-client');

var host = process.env.IP || 'localhost',
    port = require('./port');

var serverURI = 'http://' + host + ':' + port;

var clientOpts = {
  'transports'          : ['websocket'],
  'force new connection': true
};


// Exports
module.exports = function() {
  return io.connect(serverURI, clientOpts);
};