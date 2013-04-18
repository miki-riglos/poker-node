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
        initialState: stepModule.getInitialState(),
        forward     : stepModule.forward,
        finalState  : stepModule.getFinalState()
      };

    } else {
      return {
        type     : 'describe',
        directory: filePath,
        title    : stepFile.substr(3).replace('-',': ').split('_').join(' ')
      };

    }
  }

  var steps = fs.readdirSync(directory)
                   .sort()
                   .map(fileToTestObj);

  describe(title, function() {

    steps.forEach(function(step) {

      if (step.type === 'it') {

        it('Step ' + step.fileName.substr(0, 2) + ': ' + step.name, function() {
          var tournament = new Tournament(step.initialState);
          step.forward(tournament);

          if (!tournament.game) {
            tournament.stringify(['_events']).should.equal( step.finalState.stringify() );
          } else {
            tournament.stringify(['game', '_events']).should.equal( step.finalState.stringify(['game']) );
            tournament.game.stringify(['deck', 'round', '_events']).should.equal( step.finalState.game.stringify(['deck', 'round']) );
            tournament.game.deck.stringify().should.equal( step.finalState.game.deck.stringify() );
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
