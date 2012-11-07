var Tournament = require("../lib/tournament").Tournament,
    _          = require("underscore");

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
    it("should keep a property with registered players (object)", function() {
      tournament.registerPlayer(1, "Sofia").errorMessage.should.be.empty;
      tournament.registerPlayer(2, "Bianca").errorMessage.should.be.empty;
      tournament.registeredPlayers.should.be.an.instanceOf(Object);
    });  

    it("should allow players registration", function() {
      tournament.registerPlayer(1, "Sofia").errorMessage.should.be.empty;
      tournament.registerPlayer(2, "Bianca").errorMessage.should.be.empty;
      _.size(tournament.registeredPlayers).should.equal(2);
    });  

    it("should validate position uniqueness", function() {
      tournament.registerPlayer(1, "Sofia").errorMessage.should.be.empty;
      tournament.registerPlayer(1, "Bianca").errorMessage.should.equal("Position 1 already taken");
    });  

    it("should validate position minimum and maximum", function() {
      tournament.registerPlayer(0, "Sofia").errorMessage.should.not.be.empty;
      tournament.registerPlayer(11, "Sofia").errorMessage.should.not.be.empty;
    });  

    it("should allow registration only if tournament has not started", function() {
        tournament.registerPlayer(1, "Sofia").errorMessage.should.be.empty;
        tournament.registerPlayer(2, "Bianca").errorMessage.should.be.empty;
        tournament.start();
        tournament.registerPlayer(3, "Giovana").errorMessage.should.not.be.empty;
    });  
    
    it("should not allow registration if maximum number of players are registered", function() {
      var i =0;
      while (++i <= tournament.options.maximumPlayers) {
        tournament.registerPlayer(i, "Player" + i);
      }
      
      tournament.registerPlayer(11, "Player 11").errorMessage.should.not.be.empty;
    });  

  });

  describe("Get Active Players", function() {
    beforeEach(function() {
      tournament.registerPlayer(1, "Sofia");
      tournament.registerPlayer(2, "Bianca");
    });

    it("should return an array of objects with position and player", function() {
      var activePlayers = tournament.getActivePlayers();

      activePlayers.should.be.an.instanceOf(Array);
      activePlayers.length.should.equal(2);
      
      activePlayers[0].should.have.property("position");
      activePlayers[0].should.have.property("player");

      activePlayers[1].should.have.property("position");
      activePlayers[1].should.have.property("player");
    });

    it("should return an array sorted by position", function() {
      var activePlayers = tournament.getActivePlayers();
      
      activePlayers[0].position.should.equal(1);
      activePlayers[0].player.name.should.equal("Sofia");
      
      activePlayers[1].position.should.equal(2);
      activePlayers[1].player.name.should.equal("Bianca");
    });

    it("should exclude players with no chips", function() {
      tournament.registeredPlayers[2].chips = 0;
      tournament.getActivePlayers().length.should.equal(1);
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
        
        tournament.registeredPlayers[2].chips -= 5000;
        tournament.registeredPlayers[1].chips += 5000;
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
