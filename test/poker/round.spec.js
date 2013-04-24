/*global describe, it, before, beforeEach, afterEach, after*/

var Round      = require('../../poker/round').Round,
    Game       = require('../../poker/game').Game,
    Table = require('../../poker/table').Table;

var table, game, round;

describe('Round class', function() {

  beforeEach(function() {
    table = new Table();
    game       = new Game(table);
    round      = new Round(game);
  });

  it('should create new instance', function() {
    round.should.be.an.instanceOf(Round);
  });

  it('should have events', function(done) {
    round.on('event', done);
    round.emit('event');
  });
});

describe('nextPosition method', function() {
  var nexts, actions;

  beforeEach(function() {
    table = new Table();
    table.registerPlayer(1, 'Miki');
    table.registerPlayer(2, 'Giovana');
    table.registerPlayer(3, 'Sofia');
    table.registerPlayer(4, 'Bianca');
    nexts = [];
    table.on('round-next',  function() { nexts.push(table.game.round.positionToAct); });
    actions = [];
    table.on('round-raise', function(table, evt) { if (evt.type == 'regular') actions.push({position: evt.position, action: 'raise'}); });
    table.on('round-call',  function(table, evt) { actions.push({position: evt.position, action: 'call'}); });
    table.on('round-check', function(table, evt) { actions.push({position: evt.position, action: 'check'}); });
    table.on('round-fold',  function(table, evt) { actions.push({position: evt.position, action: 'fold'}); });
  });

  describe('after preflop round', function() {

    beforeEach(function() {
      table.on('table-button', function() { table.button = 1; });
    });

    it('should finish when nobody raises', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
        actions.map(function(item) { return item.position }).should.eql([4, 1, 2, 3]);
        actions.map(function(item) { return item.action   }).should.eql(['call', 'call', 'call', 'check']);
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(4);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.check(round.positionToAct);
    });

    it('should finish when 1st to act raises', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
        actions.map(function(item) { return item.position }).should.eql([4, 1, 2, 3]);
        actions.map(function(item) { return item.action   }).should.eql(['raise', 'call', 'call', 'call']);
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);
    });

    it('should finish when someone re-raises', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3, 4, 1] );
        actions.map(function(item) { return item.position }).should.eql(
          [4, 1, 2, 3, 4, 1]
        );
        actions.map(function(item) { return item.action   }).should.eql(
          ['raise', 'call', 'raise', 'fold', 'call', 'fold']
        );
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 200);

      round.positionToAct.should.equal(3);
      round.fold(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.fold(round.positionToAct);
    });

  });

  describe('after flop round', function() {

    beforeEach(function() {
      table.on('round-start', function() {
        // overrides to force flop
        table.button = 1;
        table.game.round.number = 2;
        table.game.round.positionToAct = table.button;
      });
    });

    it('should finish when everybody checks', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1] );
        actions.map(function(item) { return item.position }).should.eql([2, 3, 4, 1]);
        actions.map(function(item) { return item.action   }).should.eql(['check', 'check', 'check', 'check']);
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(2);
      round.check(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.check(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.check(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.check(round.positionToAct);
    });

    it('should finish when 1st to act raises', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1] );
        actions.map(function(item) { return item.position }).should.eql([2, 3, 4, 1]);
        actions.map(function(item) { return item.action   }).should.eql(['raise', 'call', 'call', 'call']);
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(1);
      round.call(round.positionToAct);
    });

    it('should finish when someone re-raises', function(done) {
      table.on('round-end', function() {
        nexts.should.eql( [2, 3, 4, 1, 2, 3] );
        actions.map(function(item) { return item.position }).should.eql(
          [2, 3, 4, 1, 2, 3]
        );
        actions.map(function(item) { return item.action   }).should.eql(
          ['raise', 'call', 'raise', 'fold', 'call', 'fold']
        );
        done();
      });

      table.start();
      round = table.game.round;

      round.positionToAct.should.equal(2);
      round.raise(round.positionToAct, 100);

      round.positionToAct.should.equal(3);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(4);
      round.raise(round.positionToAct, 200);

      round.positionToAct.should.equal(1);
      round.fold(round.positionToAct);

      round.positionToAct.should.equal(2);
      round.call(round.positionToAct);

      round.positionToAct.should.equal(3);
      round.fold(round.positionToAct);
    });


  });

});
