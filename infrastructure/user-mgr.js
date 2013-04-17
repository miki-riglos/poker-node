var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'users.json');

var keys = Object.keys;

// User Class
function User(name, password) {
  if (typeof name == 'object') {
    var state = name;
    name     = state.name;
    password = state.password;
  }
  this.name     = name;
  this.password = password;
}

User.prototype.toDTO = function() {
  return _.omit(this, ['password']);
};


// UserManager Class
function UserManager(override) {
  _.extend(this, override);
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
    var userToAdd = new User(name, password);
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

UserManager.prototype.authenticate = function(name, password) {
  name = name.toLowerCase();
  return (this.exist(name) && this.users[name].password === password);
};

UserManager.prototype.read = function() {
  var usersStr = JSON.stringify({});
  if (fs.existsSync(DATA_FILE)) {
    usersStr = fs.readFileSync(DATA_FILE);
  }
  return usersStr;
};

UserManager.prototype.deserialize = function(usersStr) {
  var usersIns = {},
      usersObj = JSON.parse(usersStr);

  keys(usersObj).forEach(function(userKey) {
    usersIns[userKey] = new User(usersObj[userKey]);
  });

  return usersIns;
};

UserManager.prototype.load = function() {
  var usersStr = this.read();
  this.users = this.deserialize(usersStr);
};

UserManager.prototype.serialize = function(users) {
  return JSON.stringify(users, null, 2);
};

UserManager.prototype.write = function(usersStr, cb) {
  fs.writeFile(DATA_FILE, usersStr, function(err) {
    cb(err);
  });
};

UserManager.prototype.save = function(userTouched, cb) {
  var usersStr = this.serialize(this.users);
  this.write(usersStr, function(err) {
    if (cb) cb(err, userTouched.toDTO());
  });
};


// Exports
module.exports = {
  User       : User,
  UserManager: UserManager
};
