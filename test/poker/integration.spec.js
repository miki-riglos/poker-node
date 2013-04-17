/*global describe, it, before, beforeEach, afterEach, after*/

var fs   = require('fs'),
    path = require('path');

var Tournament = require('../../poker/tournament').Tournament;

function renderTests(directory, title) {

  function fileToTestObj(stepFile) {
    var filePath = path.join(directory, stepFile);

    if ( fs.statSync(filePath).isFile() ) {
      var stepModule = require(filePath);
      return {
        type        : 'it',
        fileName    : stepFile,
        name        : stepModule.name,
        initialState: stepModule.initialState,
        forward     : stepModule.forward,
        finalState  : stepModule.finalState
      };

    } else {
      return {
        type       : 'describe',
        directory  : filePath,
        title      : stepFile
      };

    }
  }

  var steps = fs.readdirSync(directory)
                   .sort()
                   .map(fileToTestObj);

  describe(title, function() {

    steps.forEach(function(step) {

      if (step.type === 'it') {

        it('Step ' + step.fileName.substring(0, 2) + ': ' + step.name, function() {
          var tournament = new Tournament(step.initialState);
          step.forward(tournament);

          tournament.stringify(['game', '_events']).should.equal( step.finalState.stringify(['game']) );
          if (tournament.game) {
            tournament.game.stringify(['deck', 'round', '_events']).should.equal( step.finalState.game.stringify(['deck', 'round']) );
            tournament.game.round.stringify(['_events']).should.equal( step.finalState.game.round.stringify() );
          }
        });

      } else {
        renderTests(step.directory, step.title);
      }

    });

  });

}

renderTests(path.join(__dirname, 'integration-steps'), 'Integration: Poker tournament');
