var fs   = require('fs'),
    path = require('path');

var stepsDir = path.join(__dirname, 'flow-steps'),
    steps = fs.readdirSync(stepsDir)
              .sort()
              .map(function(stepFile) {
                return require( path.join(stepsDir, stepFile) );
              });

var Tournament = require('../lib/tournament').Tournament;

describe('Tournament flow', function() {

  var tournament = new Tournament();

  steps.slice(0, 13).forEach(function(step, index) {
    //Synchronous tests - no callback done
    it('Step ' + (index + 1) + ': ' + step.name, function() {
      step.forward(tournament);
      step.assert(tournament);
    });
  });

});
