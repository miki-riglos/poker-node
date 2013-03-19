var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'users.json');

// UserManager Class
function UserManager(options) {
  if (!(this instanceof UserManager)) return new UserManager(options);
  _.extend(this, options);
  this.users = {};
  this.load();
}

UserManager.prototype.exist = function(name) {
  name = name.toLowerCase();
  return (name in this.users);
};

UserManager.prototype.add = function(name, password, cb) {
  name = name.toLowerCase();
  if (!this.exist(name)) {
    var userToAdd = {name: name, password: password};
    this.users[name] = userToAdd;
    this.save(userToAdd, cb);
  } else {
    if (cb) cb(new Error('User name already exist.'));
  }
};

UserManager.prototype.remove = function(name, cb) {
  name = name.toLowerCase();
  if (this.exist(name)) {
    var userToRemove = this.users[name];
    delete this.users[name];
    this.save(userToRemove, cb);
  } else {
    if (cb) cb(new Error('User name does not exist.'));
  }
};

UserManager.prototype.load = function() {
  this.users = require(DATA_FILE);
};

UserManager.prototype.save = function(userTouched, cb) {
  fs.writeFile(DATA_FILE, JSON.stringify(this.users, null, 2), function(err) {
    if (err) {
      if (cb) cb(err);
      return;
    }
    if (cb) cb(null, userTouched);
  });
};

UserManager.prototype.authenticate = function(name, password) {
  name = name.toLowerCase();
  return (this.exist(name) && this.users[name].password === password);
};


// Exports
module.exports = {
  UserManager: UserManager
};
