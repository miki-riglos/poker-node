GLOBAL.inspect = require("util").inspect;

var fs   = require("fs"),
    path = require("path"),
    inspect = require("util").inspect;

// Helpers for testing/debugging
Object.defineProperties(Object.prototype, {
  "toInspect": {
    value: function(message, showHidden, depth) {
      console.log("\n", message ? message + "\n " : "", inspect(this, showHidden, depth, true /* colors */), "\n");
    },
    enumerable: false
  },
  "stringify": {
    value: function(exclusions) {
      exclusions = exclusions || [];
      return JSON.stringify(this, function(key, value) { return exclusions.indexOf(key) != -1 ? undefined : value });
    },
    enumerable: false
  }
});

var Tournament = require("../lib/tournament").Tournament;

describe("Tournament flow", function() {

  var stepsDir = path.join(__dirname, "flow-steps");
  var steps = fs.readdirSync(stepsDir)
                .sort()
                .map(function(stepFile) {
                  return require( path.join(stepsDir, stepFile) );
                });

  var tournament = new Tournament();

  steps.slice(0, 8).forEach(function(step, index) {
    //Synchronous tests - no callback done
    it('Step ' + (index + 1) + ': ' + step.name, function() {
      step.forward(tournament);
      step.assert(tournament);
    });
  });

});
