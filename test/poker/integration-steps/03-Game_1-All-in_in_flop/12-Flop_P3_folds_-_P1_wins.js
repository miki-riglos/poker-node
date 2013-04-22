module.exports = {

  name: 'Player 3 (Sofia) folds, flop round and game ends, Player 1 (Miki) wins',

  initialStep: require('./11-Flop_P2_folds'),

  forward: function(tournament) {
    tournament.once('game-start', function() {
      var Deck = require('../../../../poker/deck').Deck;
      tournament.game.deck = new Deck(); // Reassign for testing (not shuffled)
    });
    tournament.players[3].folds();
  },

  getFinalState: function() {
    return {
      options: {
        initialChips  : 10000,
        maximumPlayers: 10,
        initialBlinds : {
          small: 10,
          big  : 25
        }
      },
      status: 'start',
      button: 1,
      blinds: {
        small: 10,
        big  : 25
      },
      players: {
        '1': { name: 'Miki',    chips:  12075 },
        '2': { name: 'Giovana', chips:  8975 },
        '3': { name: 'Sofia',   chips:  8975 },
        '4': { name: 'Bianca',  chips:  9975 }
      },
      gameCounter: 1,
      game: {
        number: 1,
        handsInfo: {
          '1': { hand    : [ {rank: '3', suit: 'C'}, {rank: '7', suit: 'C'} ],
                 folded  : false,
                 totalBet: 10000 },
          '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
                 folded  : true,
                 totalBet: 1025 },
          '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
                 folded  : true,
                 totalBet: 1025 },
          '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
                 folded  : true,
                 totalBet: 25 }
        },
        pot: 12075,
        deck: (function() {
          var Deck = require('../../../../poker/deck').Deck, deck = new Deck();
          deck.splice(0, 13);
          return JSON.parse(JSON.stringify(deck));
        })(),
        flop : [ {rank:'Q', suit:'C'}, {rank:'K', suit:'C'}, {rank:'A', suit:'C'} ],
        turn : {},
        river: {},
        burnt: [ {rank:'2', suit:'C'}, {rank:'J', suit:'C'} ],
        winners: [1],
        roundCounter: 2,
        round: {
          number: 2,    // 'flop'
          actionsInfo: {
            '1': { actions : ['raise'],
                   bets    : [8975] },
            '2': { actions : ['check', 'fold'],
                   bets    : [] },
            '3': { actions : ['check', 'fold'],
                   bets    : [] }
          },
          positionToAct: null,
          hasActed : [1, 2, 3],
          betToCall: 8975
        }
      }
    };
  },

  nextStep: {
    name         : 'Round of Game 2 starts',
    eventName    : 'round-next',
    isFinalEvent : function(tournament) { return (tournament.gameCounter === 2 && tournament.game.round.positionToAct === 1); },
    getFinalState: function() {
      return {
      options: {
        initialChips  : 10000,
        maximumPlayers: 10,
        initialBlinds : {
          small: 10,
          big  : 25
        }
      },
      status: 'start',
      button: 2,
      blinds: {
        small: 10,
        big  : 25
      },
      players: {
        '1': { name: 'Miki',    chips:  12075 },
        '2': { name: 'Giovana', chips:  8975 },
        '3': { name: 'Sofia',   chips:  8965 },
        '4': { name: 'Bianca',  chips:  9950 }
      },
      gameCounter: 2,
      game: {
        number: 2,
        handsInfo: {
          '1': { hand    : [ {rank: '3', suit: 'C'}, {rank: '7', suit: 'C'} ],
                 folded  : false,
                 totalBet: 0 },
          '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
                 folded  : false,
                 totalBet: 0 },
          '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
                 folded  : false,
                 totalBet: 10 },
          '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
                 folded  : false,
                 totalBet: 25 },
        },
        pot: 35,
        deck: (function() {
          var Deck = require('../../../../poker/deck').Deck, deck = new Deck();
          deck.splice(0, 9);
          return JSON.parse(JSON.stringify(deck));
        })(),
        flop : [],
        turn : {},
        river: {},
        burnt: [ {rank:'2', suit:'C'} ],
        winners: [],
        roundCounter: 1,
        round: {
          number: 1,
          actionsInfo: {
            '1': { actions : [],
                   bets    : [] },
            '2': { actions : [],
                   bets    : [] },
            '3': { actions : ['raise-sb'],
                   bets    : [10] },
            '4': { actions : ['raise-bb'],
                   bets    : [25] }
          },
          positionToAct: 1,
          hasActed : [],
          betToCall: 25
        }
      }
      };
    }
  }
};
