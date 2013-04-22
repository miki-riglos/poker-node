/*global describe, it, before, beforeEach, afterEach, after*/

var fs   = require('fs'),
    path = require('path');

var Tournament = require('../../poker/tournament').Tournament;

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
    var tournament = new Tournament(),
        steps      = getSteps();

    var expectedCounter  = {
            tournament: {start: 1, button: 2, end: 1},
            game      : {start: 2, end: 1},
            round     : {start: 3, end: 2}
          },
        expectedSequence = ['tournament-start',
                            'tournament-button',
                              'game-start|1',
                                'round-start|1.1', 'round-end|1.1',
                                'round-start|1.2', 'round-end|1.2',
                              'game-end|1',
                            'tournament-button',
                              'game-start|2',
                                'round-start|2.1',
                            'tournament-end'];

    var actualCounter = {
            tournament: {start: 0, button: 0, end: 0},
            game      : {start: 0, end: 0},
            round     : {start: 0, end: 0}
          },
        actualSequence  = [];

    function updateActual(eventName) {
      var parts = eventName.split('-'),
          game_round = '';

      ++actualCounter[parts[0]][parts[1]];

      if (['game', 'round'].indexOf(parts[0]) != -1) game_round += tournament.gameCounter;
      if (parts[0] === 'round') game_round += '.' + tournament.game.roundCounter;
      actualSequence.push(eventName + (game_round ? '|' + game_round : ''));
    }

    tournament.on('tournament-start',  function() { updateActual('tournament-start'); });
    tournament.on('tournament-button', function() { updateActual('tournament-button'); });
    tournament.on(  'game-start',      function() { updateActual('game-start'); });
    tournament.on(    'round-start',   function() { updateActual('round-start'); });
    tournament.on(    'round-end',     function() { updateActual('round-end'); });
    tournament.on(  'game-end',        function() { updateActual('game-end'); });
    tournament.on('tournament-end',    function() { updateActual('tournament-end');
      actualCounter.stringify().should.equal( expectedCounter.stringify() );
      actualSequence.stringify().should.equal( expectedSequence.stringify() );
      done();
    });

    function nextStep() {
      var step = steps.shift();
      if (!step) {
        tournament.end();
        return;
      }

      if (!step.nextStep) {
        step.forward(tournament);
        nextStep();
      } else {
        var eventHandler = function() {
          if (step.nextStep.isFinalEvent.apply(tournament, arguments)) {
            tournament.removeListener(step.nextStep.eventName, eventHandler);
            nextStep(tournament);
          }
        };
        tournament.on(step.nextStep.eventName, eventHandler);
        step.forward(tournament);
      }
    }

    tournament.start();
    nextStep(tournament);

  });

});