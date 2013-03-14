var fs   = require('fs'),
    path = require('path');

var file  = path.join(__dirname, 'db', 'users.json'),
    users = require(file);

function exist(name) {
  return (name in users);
}

function add(name, password, cb) {
  if (!exist(name)) {
    var userToAdd = {name: name, password: password};
    users[name] = userToAdd;
    save(userToAdd, cb);
  } else {
    if (cb) cb(new Error('User name already exist.'));
  }
}

function remove(name, cb) {
  if (exist(name)) {
    var userToRemove = users[name];
    delete users[name];
    save(userToRemove, cb);
  } else {
    if (cb) cb(new Error('User name does not exist.'));
  }
}

function save(userTouched, cb) {
  fs.writeFile(file, JSON.stringify(users, null, 2), function(err) {
    if (err) {
      if (cb) cb(err);
      return;
    }
    if (cb) cb(null, userTouched);
  });
}

function authenticate(name, password) {
  return (exist(name) && users[name].password === password);
}

// Exports
module.exports = {
  exist : exist,
  add   : add,
  remove: remove,
  authenticate: authenticate
};
