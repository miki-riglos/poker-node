var fs   = require('fs'),
    path = require('path');

var stepsDir = path.join(__dirname, 'flow-steps'),
    steps = fs.readdirSync(stepsDir)
              .sort()
              .map(function(stepFile) {
                return require( path.join(stepsDir, stepFile) );
              });

var Tournament = require('../lib/tournament').Tournament;

describe('Tournament events', function() {

  it('should trigger all events', function() {
    var tournament = new Tournament(),
        actualCounter   = { tournament: {start: 0, end: 0} },
        expectedCounter = { tournament: {start: 1, end: 1} };

    tournament.on('tournament-start', function () { ++actualCounter.tournament.start; });
    tournament.on('tournament-end',   function () { ++actualCounter.tournament.end; });


    steps.slice(0, 13).forEach(function(step, index) {
      step.forward(tournament);
    });
    tournament.end();


    actualCounter.stringify().should.equal( expectedCounter.stringify() );
  });

});
