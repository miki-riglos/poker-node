/*global describe, it, before, beforeEach, afterEach, after*/

var Table = require('../../poker/table').Table;

var fs   = require('fs'),
    path = require('path');

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
                          eventName    : stepMod.nextStep.eventName,
                          isFinalEvent : stepMod.nextStep.isFinalEvent,
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

function renderAsserts(table, finalState) {
  if (!table.game) {
    table.stringify('_events').should.equal( finalState.stringify() );
  } else {
    table.stringify('game', '_events').should.equal( finalState.stringify('game') );
    table.game.stringify('deck', 'round', '_events').should.equal( finalState.game.stringify('deck', 'round') );
    table.game.deck.stringify().should.equal( finalState.game.deck.stringify() );
    table.game.round.stringify('_events').should.equal( finalState.game.round.stringify() );
  }
}

function renderIt(step) {
  it('Step ' + step.fileName.substr(0, 2) + ': ' + step.name, function() {
    var table = new Table(step.getInitialState());
    step.forward(table);

    renderAsserts(table, step.getFinalState());
  });
}

function renderNextIt(step) {
  it('Step ' + step.fileName.substr(0, 2) + ': ' + step.name + ' -- Next: ' + step.nextStep.name, function(done) {
    var table = new Table(step.getInitialState());

    table.on(step.nextStep.eventName, function() {
      if (step.nextStep.isFinalEvent.apply(table, arguments)) {
        renderAsserts(table, step.nextStep.getFinalState());
        done();
      }
    });

    step.forward(table);
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

renderDescribe(path.join(__dirname, 'integration-steps'), 'Integration: Poker table');
