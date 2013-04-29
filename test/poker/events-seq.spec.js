/*global describe, it, before, beforeEach, afterEach, after*/

var Table = require('../../poker/table').Table;

var fs   = require('fs'),
    path = require('path');

function getSteps() {
  var files1, files2,
      steps;

  files1 = fs.readdirSync(path.join(__dirname, 'integration-steps'))
             .map(function(file) { return path.join(__dirname, 'integration-steps', file); });

  files2 = fs.readdirSync(path.join(__dirname, 'integration-steps', '03-Game_1-All-in_in_flop'))
             .map(function(file) { return path.join(__dirname, 'integration-steps', '03-Game_1-All-in_in_flop', file); });

  steps = files1.concat(files2)
            .filter(function(filePath) { return fs.statSync(filePath).isFile(); })
            .sort()
            .map(function(filePath) { return require(filePath); } );

  return steps;
}

describe('Events sequence', function() {

  it('should fire events in order', function(done) {
    var table = new Table(),
        steps = getSteps();

    var expectedCounter  = {
            table: {start: 1, button: 2, end: 1},
            game      : {start: 2, end: 1},
            round     : {start: 3, end: 2}
          },
        expectedSequence = ['table-start',
                            'table-button',
                              'game-start|1',
                                'round-start|1.1', 'round-end|1.1',
                                'round-start|1.2', 'round-end|1.2',
                              'game-end|1',
                            'table-button',
                              'game-start|2',
                                'round-start|2.1',
                            'table-end'];

    var actualCounter = {
            table: {start: 0, button: 0, end: 0},
            game      : {start: 0, end: 0},
            round     : {start: 0, end: 0}
          },
        actualSequence  = [];

    function updateActual(eventName) {
      var parts = eventName.split('-'),
          game_round = '';

      ++actualCounter[parts[0]][parts[1]];

      if (['game', 'round'].indexOf(parts[0]) != -1) game_round += table.gameCounter;
      if (parts[0] === 'round') game_round += '.' + table.game.roundCounter;
      actualSequence.push(eventName + (game_round ? '|' + game_round : ''));
    }

    table.on('table-start',  function() { updateActual('table-start'); });
    table.on('table-button', function() { updateActual('table-button'); });
    table.on(  'game-start',      function() { updateActual('game-start'); });
    table.on(    'round-start',   function() { updateActual('round-start'); });
    table.on(    'round-end',     function() { updateActual('round-end'); });
    table.on(  'game-end',        function() { updateActual('game-end'); });
    table.on('table-end',    function() { updateActual('table-end');
      actualCounter.stringify().should.equal( expectedCounter.stringify() );
      actualSequence.stringify().should.equal( expectedSequence.stringify() );
      done();
    });

    function nextStep() {
      var step = steps.shift();
      if (!step) {
        table.end();
        return;
      }

      if (!step.nextStep) {
        step.forward(table);
        nextStep();
      } else {
        var eventHandler = function() {
          if (step.nextStep.isFinalEvent.apply(table, arguments)) {
            table.removeListener(step.nextStep.eventName, eventHandler);
            nextStep(table);
          }
        };
        table.on(step.nextStep.eventName, eventHandler);
        step.forward(table);
      }
    }

    table.start();
    nextStep(table);

  });

});