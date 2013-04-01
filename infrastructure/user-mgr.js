var fs   = require('fs'),
    path = require('path'),
    _    = require('underscore');

var DATA_FILE = path.join(__dirname, 'db', 'users.json');

// User Class
function User(name, password) {
  if (!(this instanceof User)) return new User(name, password);
  this.name     = name;
  this.password = password;
}

User.prototype.toDTO = function() {
  return {
    name: this.name
  };
};


// UserManager Class
function UserManager(override) {
  if (!(this instanceof UserManager)) return new UserManager(override);
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
    var userToAdd = User(name, password);
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

UserManager.prototype.read = function() {
  var flatUsers = JSON.stringify({});
  if (fs.existsSync(DATA_FILE)) {
    flatUsers = fs.readFileSync(DATA_FILE);
  }
  return flatUsers;
};

UserManager.prototype.deserialize = function(flatUsers) {
  var usersIns = {},
      usersObj = JSON.parse(flatUsers);

  Object.keys(usersObj).forEach(function(userKey) {
    usersIns[userKey] = User(usersObj[userKey].name, usersObj[userKey].password);
  });

  return usersIns;
};

UserManager.prototype.load = function() {
  var flatUsers = this.read();
  this.users = this.deserialize(flatUsers);
};

UserManager.prototype.serialize = function(users) {
  return JSON.stringify(users, null, 2);
};

UserManager.prototype.write = function(flatUsers, cb) {
  fs.writeFile(DATA_FILE, flatUsers, function(err) {
    cb(err);
  });
};

UserManager.prototype.save = function(userTouched, cb) {
  var flatUsers = this.serialize(this.users);
  this.write(flatUsers, function(err) {
    if (cb) cb(err, userTouched.toDTO());
  });
};

UserManager.prototype.authenticate = function(name, password) {
  name = name.toLowerCase();
  return (this.exist(name) && this.users[name].password === password);
};


// Exports
module.exports = {
  User       : User,
  UserManager: UserManager
};
