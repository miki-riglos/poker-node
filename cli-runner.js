if( !process.env.NODE_ENV ) process.env.NODE_ENV = 'test';

var path = require('path');
require(path.join(__dirname, 'node_modules/jasmine-node/lib/jasmine-node/cli.js'));
