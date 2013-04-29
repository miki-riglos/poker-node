/*global describe, it, before, beforeEach, afterEach, after*/

var UserManager = require('../../infrastructure/user-mgr').UserManager,
    override    = require('./setup/user-mgr.over'),
    User        = require('../../infrastructure/user-mgr').User;

var keys = Object.keys;

describe('UserManager class', function() {
  var userMgr;

  beforeEach(function() {
    userMgr = new UserManager(override); // Override load and save methods
  });

  describe('Adding users', function() {
    var userAdded;

    beforeEach(function(done) {
      userMgr.add('giovana', 'pass', function(err, firstUserAdded) {
        userAdded = firstUserAdded;
        done();
      });
    });

    it('should add user', function() {
      userAdded.should.have.property('name', 'giovana');
      userAdded.should.not.have.property('password');
      userMgr.users['giovana'].name.should.equal(userAdded.name);
      userMgr.users['giovana'].password.should.equal('pass');
    });

    it('should error out when adding existing user name', function(done) {
      userMgr.add('giovana', 'pass', function(err, userAdded) {
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message');
        done();
      });
    });

    it('should ignore case', function(done) {
      userMgr.add('Giovana', 'pass', function(err, userAdded) {
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message');
        done();
      });
    });

    describe('Authenticating users', function() {
      it('should authenticate user', function() {
        userMgr.authenticate('giovana', 'pass').should.be.true;
        userMgr.authenticate('Giovana', 'pass').should.be.true;
        userMgr.authenticate('giovana', 'nopass').should.be.false;
        userMgr.authenticate('miki', 'pass').should.be.false;
      });
    });

    afterEach(function() {
      keys(userMgr.users).should.have.lengthOf(1);
    });
  });

  describe('Removing users', function() {

    beforeEach(function(done) {
      userMgr.add('giovana', 'pass', done);
    });

    it('should remove user', function(done) {
      userMgr.remove('giovana', function(err, userRemoved) {
        userRemoved.name.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing user name', function(done) {
      userMgr.remove('giovana', function(err, userRemoved) {
        userMgr.remove('giovana', function(err, userRemoved) {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message');
          done();
        });
      });
    });

    it('should ignore case', function(done) {
      userMgr.remove('Giovana', function(err, userRemoved) {
        userRemoved.name.should.equal('giovana');
        done();
      });
    });

    afterEach(function() {
      Object.keys(userMgr.users).should.have.length(0);
    });

  });

  describe('Deserialization', function() {

    beforeEach(function(done) {
      userMgr.add('giovana', 'pass', done);
    });

    it('should deserialize users', function() {
      var usersStr = userMgr.serialize(userMgr.users),
          usersIns = userMgr.deserialize(usersStr);

      usersIns['giovana'].should.be.an.instanceOf(User);
      usersIns['giovana'].name.should.equal('giovana');
      usersIns['giovana'].password.should.equal('pass');
    });

  });

});
