var User        = require('../../infrastructure/user-mgr').User,
    UserManager = require('../../infrastructure/user-mgr').UserManager;

describe('UserManager class', function() {
  var userMgr;
  var override = {
    load: function() {
      this.users = {};
    },
    save: function(userTouched, cb) {
      if (cb) cb(null, userTouched.toDTO());
    }
  };

  beforeEach(function() {
    userMgr = UserManager(override); // Override load and save methods
  });

  describe('adding users', function() {
    var userAdded;

    beforeEach(function(done) {
      userMgr.add('giovana', 'pass', function(err, firstUserAdded) {
        userAdded = firstUserAdded;
        done();
      });
    });

    it('should add user', function(done) {
      Object.keys(userAdded).should.include('name');
      userAdded.name.should.equal('giovana');
      Object.keys(userAdded).should.not.include('password');
      userMgr.users['giovana'].name.should.equal(userAdded.name);
      userMgr.users['giovana'].password.should.equal('pass');
      done();
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

    describe('authenticating users', function() {
      it('should authenticate user', function() {
        userMgr.authenticate('giovana', 'pass').should.be.true;
        userMgr.authenticate('Giovana', 'pass').should.be.true;
        userMgr.authenticate('giovana', 'nopass').should.be.false;
        userMgr.authenticate('miki', 'pass').should.be.false;
      });
    });

    afterEach(function() {
      Object.keys(userMgr.users).should.have.length(1);
    });
  });

  describe('removing users', function() {

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

  describe('serialization', function() {

    beforeEach(function(done) {
      userMgr.add('giovana', 'pass', done);
    });

    it('should serialize/deserialize users', function() {
      var usersStr  = userMgr.serialize(userMgr.users),
          usersIns = userMgr.deserialize(usersStr);

      usersIns['giovana'].should.be.an.instanceOf(User);
      usersIns['giovana'].name.should.equal('giovana');
      usersIns['giovana'].password.should.equal('pass');
    });

  });

});
