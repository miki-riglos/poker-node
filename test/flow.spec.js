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

  //steps = [steps[0],steps[1]];
  
  steps.forEach(function(step, index) {
    //Synchronous tests - no done()
    it('Step ' + (index+1) + ': ' + step.name, function() {
      step.forward(tournament).assert();
    });
  });

});
