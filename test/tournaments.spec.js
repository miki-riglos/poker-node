var Tournament = require("../lib/tournaments").Tournament;

describe("Tournament class", function() {
  var tournament;

  beforeEach(function() {
    tournament = new Tournament();
  });

  it("should create new instance", function() {
    tournament.should.be.an.instanceOf( Tournament );
  });

  it("should accept options", function() {
    var tournamentWithOptions = new Tournament( {initialChips: 100} );
    tournamentWithOptions.options.initialChips.should.equal( 100 );
  });
  
  describe("Registration", function() {
    it("should allow players registration", function() {
      tournament.registerPlayer(1, "Sofia");
      tournament.registerPlayer(2, "Bianca");
      Object.keys( tournament.registeredPlayers ).length.should.equal( 2 );
    });  

    it("should validate position uniqueness", function() {
      (function() { 
        tournament.registerPlayer(1, "Sofia");
        tournament.registerPlayer(1, "Bianca");
      }).should.throwError("Position 1 already taken");
    });  

    it("should validate position minimum and maximum", function() {
      (function() { 
        tournament.registerPlayer(0, "Sofia");
      }).should.throwError();
      (function() { 
        tournament.registerPlayer(11, "Sofia");
      }).should.throwError();
    });  

    it("should allow registration only if tournament has not started", function() {
      (function() { 
        tournament.registerPlayer(1, "Sofia");
        tournament.registerPlayer(2, "Bianca");
        tournament.start();
        tournament.registerPlayer(3, "Giovana");
      }).should.throwError();
    });  
    
  });

});
