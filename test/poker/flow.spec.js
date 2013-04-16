/*global describe, it, before, beforeEach, afterEach, after*/

var fs   = require('fs'),
    path = require('path');

var stepsDir = path.join(__dirname, 'flow-steps'),
    steps    = fs.readdirSync(stepsDir)
                 .sort()
                 .map(function(stepFile) {
                   return require( path.join(stepsDir, stepFile) );
                 });

var Tournament = require('../../poker/tournament').Tournament;

describe('Tournament flow', function() {

  var tournament = new Tournament();

  var actualCounter = {
          tournament: {start: 0, error: 0, button: 0, end: 0},
          game      : {start: 0, end: 0},
          round     : {start: 0, error: 0, end: 0}
        },
      actualSequence  = [];

  function updateActual(eventName) {
    var parts = eventName.split('-'),
        game_round = '';

    ++actualCounter[parts[0]][parts[1]];

    if (['game', 'round'].indexOf(parts[0]) != -1) game_round += tournament.gameCounter;
    if (parts[0] === 'round') game_round += '.' + tournament.currentGame.roundCounter;
    actualSequence.push(eventName + (game_round ? '|' + game_round : ''));
  }

  tournament.on('tournament-start' , function() { updateActual('tournament-start') });
  tournament.on('tournament-error' , function() { updateActual('tournament-error') });
  tournament.on('tournament-button', function() { updateActual('tournament-button') });
    tournament.on('game-start'     , function() { updateActual('game-start') });
      tournament.on('round-start'  , function() { updateActual('round-start') });
//      tournament.on('round-error'  , function() { updateActual('round-error') });
//      tournament.on('round-raise'  , function() { updateActual('round-raise') });
//      tournament.on('round-call'   , function() { updateActual('round-call') });
//      tournament.on('round-check'  , function() { updateActual('round-check') });
//      tournament.on('round-fold'   , function() { updateActual('round-fold') });
      tournament.on('round-end'    , function() { updateActual('round-end') });
    tournament.on('game-end'       , function() { updateActual('game-end') });
  tournament.on('tournament-end'   , function() { updateActual('tournament-end') });

  steps.slice(0, 13).forEach(function(step, index) {
    //Synchronous tests - no callback done
    it('Step ' + (index + 1) + ': ' + step.name, function() {
      step.forward(tournament);
      step.assert(tournament);
    });
  });

  it('Events in order', function() {
    var expectedCounter  = {
            tournament: {start: 1, error: 0, button: 2, end: 1},
            game      : {start: 2, end: 1},
            round     : {start: 3, error: 0, end: 2}
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

    tournament.end(); //TODO: will be eventually in the last step
    actualCounter.stringify().should.equal( expectedCounter.stringify() );
    actualSequence.stringify().should.equal( expectedSequence.stringify() );
  });

});