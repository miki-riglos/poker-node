var Tournament = require("../lib/tournament").Tournament;

describe("Tournament class", function() {
  var tournament;

  beforeEach(function() {
    tournament = new Tournament();
  });

  it("should create new instance", function() {
    tournament.should.be.an.instanceOf(Tournament);
  });

  it("should have events", function(done) {
    tournament.on("event", function() {
      tournament.should.be.ok;
      done();
    });    
    tournament.emit("event");
  });
  
  it("should accept options", function() {
    var tournamentWithOptions = new Tournament( {initialChips: 100} );
    tournamentWithOptions.options.initialChips.should.equal(100);
  });
  
  describe("Registration", function() {
    it("should allow players registration", function() {
      tournament.registerPlayer(1, "Sofia");
      tournament.registerPlayer(2, "Bianca");
      Object.keys( tournament.players ).length.should.equal(2);
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
    
    it("should auto start when maximum number of players are registered", function() {
      var i =0;
      while (++i <= 10) {
        tournament.registerPlayer(i, "Player" + i);
      }
      
      (function() { 
        tournament.registerPlayer(11, "Player 11");
      }).should.throwError();
    });  

  });

  describe("Active Players", function() {
    beforeEach(function() {
      tournament.registerPlayer(1, "Sofia");
      tournament.registerPlayer(2, "Bianca");
    });

    it("should return active players", function() {
      Object.keys( tournament.getActivePlayers() ).length.should.equal(2);
    });

    it("should exclude players with no chips", function() {
      tournament.players[2].chips = 0;
      Object.keys( tournament.getActivePlayers() ).length.should.equal(1);
    });
  });
  
  describe("Game cycles", function() {
    beforeEach(function() {
      tournament.registerPlayer(1, "Sofia");
      tournament.registerPlayer(2, "Bianca");
    });

    it("should emit start and end events", function(done) {
      var counter = {
        tournament: {start: 0, end: 0},
        game      : {start: 0, end: 0}
      };
      
      tournament.on("tournament-start", function() {
        counter.tournament.start++;
      });
      tournament.on("game-start", function() {
        counter.game.start++;
        
        tournament.players[2].chips -= 5000;
        tournament.players[1].chips += 5000;
        tournament.currentGame.end();
      });
      tournament.on("game-end", function() {
        counter.game.end++;
      });
      tournament.on("tournament-end", function() {
        counter.tournament.end++;
        
        counter.tournament.start.should.equal(1);
        counter.game.start.should.equal(2);
        counter.game.end.should.equal(2);
        counter.tournament.end.should.equal(1);
        
        done();
      });
      
      tournament.start();
      
    });

  });
});
