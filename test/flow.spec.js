var fs   = require("fs"),
    path = require("path");

var Tournament = require("../lib/tournament").Tournament;

describe("Tournament flow", function() {

  var stepsDir = path.join(__dirname, "flow-steps");
  var steps = fs.readdirSync(stepsDir)
                .sort()
                .map(function(stepFile) {
                  return require( path.join(stepsDir, stepFile) );
                });

  var tournament = new Tournament();

  steps.slice(0, 2).forEach(function(step, index) {
    //Synchronous tests - no callback done
    it('Step ' + (index+1) + ': ' + step.name, function() {
      step.forward(tournament);
      step.assert(tournament);
    });
  });

});
