/*global describe, it, before, beforeEach, afterEach, after*/

var fs   = require('fs'),
    path = require('path');

var Tournament = require('../../poker/tournament').Tournament;

function fileToStep(directory, stepFile) {
  var filePath = path.join(directory, stepFile);

  if ( fs.statSync(filePath).isFile() ) {
    var stepMod = require(filePath);
    return {
      type            : 'it',
      fileName        : stepFile,
      name            : stepMod.name,
      getInitialState : stepMod.initialStep.nextStep ? stepMod.initialStep.nextStep.getFinalState : stepMod.initialStep.getFinalState,
      forward         : stepMod.forward,
      getFinalState   : stepMod.getFinalState,
      nextStep        : stepMod.nextStep ? {
                          name         : stepMod.nextStep.name,
                          on           : stepMod.nextStep.on,
                          getFinalState: stepMod.nextStep.getFinalState
                        } : null
    };

  } else {
    return {
      type     : 'describe',
      directory: filePath,
      title    : stepFile.substr(3).replace('-',': ').split('_').join(' ')
    };

  }
}

function renderAsserts(tournament, finalState) {
  if (!tournament.game) {
    tournament.stringify('_events').should.equal( finalState.stringify() );
  } else {
    tournament.stringify('game', '_events').should.equal( finalState.stringify('game') );
    // tournament.players.stringify().should.equal( finalState.players.stringify() );
    tournament.game.stringify('deck', 'round', '_events').should.equal( finalState.game.stringify('deck', 'round') );
    tournament.game.deck.stringify().should.equal( finalState.game.deck.stringify() );
    tournament.game.round.stringify('_events').should.equal( finalState.game.round.stringify() );
  }
}

function renderIt(step, tournament) {
  it('Step ' + step.fileName.substr(0, 2) + ': ' + step.name, function() {
    var tournament = new Tournament(step.getInitialState());
    step.forward(tournament);

    renderAsserts(tournament, step.getFinalState());
  });
}

function renderNextIt(step) {
  it('Step ' + step.fileName.substr(0, 2) + ': ' + step.name + ' -- Next: ' + step.nextStep.name, function(done) {
    var tournament = new Tournament(step.getInitialState());

    tournament.on(step.nextStep.on, function() {
      renderAsserts(tournament, step.nextStep.getFinalState());
      done();
    });

    step.forward(tournament);
  });
}

function renderDescribe(directory, title) {
  var steps = fs.readdirSync(directory)
                .sort()
                .map(fileToStep.bind(undefined, directory));

  describe(title, function() {

    steps.forEach(function(step) {
      if (step.type === 'it') {
        renderIt(step);
        if (step.nextStep) renderNextIt(step);
      } else {
        renderDescribe(step.directory, step.title);
      }
    });

  });

}

renderDescribe(path.join(__dirname, 'integration-steps'), 'Integration: Poker tournament');
