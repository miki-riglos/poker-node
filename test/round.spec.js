var Round = require('../lib/round').Round;

describe('Round class', function() {
  var round;

  beforeEach(function() {
    round = Round(1, 1, {}, {}, {}, []);
  });

  it('should create new instance', function() {
    round.should.be.an.instanceOf(Round);
  });

  it('should have events', function(done) {
    round.on('event', done);
    round.emit('event');
  });

});