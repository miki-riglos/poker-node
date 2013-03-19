var UserManager = require('../../infrastructure/user-mgr').UserManager;

describe('UserManager class', function() {
  var roomMgr;
  var options = {
    load: function() {
      this.users = {};
    },
    save: function(userTouched, cb) {
      if (cb) cb(null, userTouched);
    }
  };
  var userAdded;

  beforeEach(function() {
    roomMgr = UserManager(options); // Overwrite load and save methods
  });

  describe('adding users', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', 'pass', function(err, firstUserAdded) {
        userAdded = firstUserAdded;
        done();
      });
    });

    it('should add user', function(done) {
      userAdded.name.should.equal('giovana');
      userAdded.password.should.equal('pass');
      roomMgr.users['giovana'].password.should.equal(userAdded.password);
      done();
    });

    it('should error out when adding existing user name', function(done) {
      roomMgr.add('giovana', 'pass', function(err, userAdded) {
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message');
        done();
      });
    });

    it('should ignore case', function(done) {
      roomMgr.add('Giovana', 'pass', function(err, userAdded) {
        err.should.be.an.instanceOf(Error);
        err.should.have.property('message');
        done();
      });
    });

    describe('authenticating users', function() {
      it('should authenticate user', function() {
        roomMgr.authenticate('giovana', 'pass').should.be.true;
        roomMgr.authenticate('Giovana', 'pass').should.be.true;
        roomMgr.authenticate('giovana', 'nopass').should.be.false;
        roomMgr.authenticate('miki', 'pass').should.be.false;
      });
    });

    afterEach(function() {
      Object.keys(roomMgr.users).should.have.length(1);
    });
  });

  describe('removing users', function() {

    beforeEach(function(done) {
      roomMgr.add('giovana', 'pass', done);
    });

    it('should remove user', function(done) {
      roomMgr.remove('giovana', function(err, userRemoved) {
        userRemoved.name.should.equal('giovana');
        done();
      });
    });

    it('should error out when removing non-existing user name', function(done) {
      roomMgr.remove('giovana', function(err, userRemoved) {
        roomMgr.remove('giovana', function(err, userRemoved) {
          err.should.be.an.instanceOf(Error);
          err.should.have.property('message');
          done();
        });
      });
    });

    it('should ignore case', function(done) {
      roomMgr.remove('Giovana', function(err, userRemoved) {
        userRemoved.name.should.equal('giovana');
        done();
      });
    });

    afterEach(function() {
      Object.keys(roomMgr.users).should.have.length(0);
    });

  });

});