/*global describe, it, before, beforeEach, afterEach, after*/

var Table = require('../../poker/table').Table;

var keys = Object.keys;

var table;

describe('Table class', function() {

  beforeEach(function() {
    table = new Table();
  });

  it('should create new instance', function() {
    table.should.be.an.instanceOf(Table);
  });

  it('should have events', function(done) {
    table.on('event', done);
    table.emit('event');
  });

  describe('Registration', function() {

    it('should allow players registration', function() {
      table.registerPlayer(1, 'Sofia').success.should.be.true;
      table.registerPlayer(2, 'Bianca').success.should.be.true;
      keys(table.players).should.have.lengthOf(2);
    });

    it('should validate position uniqueness', function() {
      table.registerPlayer(1, 'Sofia').success.should.be.true;
      table.registerPlayer(1, 'Bianca').success.should.be.false;
      table.registerPlayer(1, 'Bianca').message.should.not.be.empty;
    });

    it('should validate position minimum and maximum', function() {
      table.registerPlayer(0, 'Sofia').success.should.be.false;
      table.registerPlayer(11, 'Sofia').success.should.be.false;
    });

    it('should allow registration only if table has not started', function() {
        table.registerPlayer(1, 'Sofia').success.should.be.true;
        table.registerPlayer(2, 'Bianca').success.should.be.true;
        table.start();
        table.registerPlayer(3, 'Giovana').success.should.be.false;
    });

    it('should not allow registration if maximum number of players are registered', function() {
      var i = 0;
      while (++i <= table.options.maximumPlayers) {
        table.registerPlayer(i, 'Player' + i);
      }

      table.registerPlayer(11, 'Player 11').success.should.be.false;
    });

  });

  describe('nextButton method', function() {

    it('should assign next button', function() {
      table.registerPlayer(1, 'Sofia');
      table.registerPlayer(2, 'Bianca');
      table.registerPlayer(3, 'Giovana');
      table.registerPlayer(4, 'Miki');
      table.players[3].chips = 0;
      table.button = 1;

      table.nextButton();
      table.button.should.equal(2);

      table.nextButton();
      table.button.should.equal(4);

      table.nextButton();
      table.button.should.equal(1);
    });

  });
});