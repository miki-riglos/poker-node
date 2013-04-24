module.exports = {

  name: 'Player 4 (Bianca) calls 25',

  initialStep: require('../02-table_starts'),

  forward: function(table) {
    table.players[4].calls();
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
        '1': { name: 'Miki',    chips: 10000 },
        '2': { name: 'Giovana', chips:  9990 },
        '3': { name: 'Sofia',   chips:  9975 },
        '4': { name: 'Bianca',  chips:  9975 }
      },
      gameCounter: 1,
      game: {
        number: 1,
        handsInfo: {
          '1': { hand    : [ {rank: '3', suit: 'C'}, {rank: '7', suit: 'C'} ],
                 folded  : false,
                 totalBet: 0 },
          '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
                 folded  : false,
                 totalBet: 10 },
          '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
                 folded  : false,
                 totalBet: 25 },
          '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
                 folded  : false,
                 totalBet: 25 }
        },
        pot: 60,
        deck: (function() {
          var Deck = require('../../../../poker/deck').Deck,
              deck = new Deck();
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
          number: 1,    // 'preflop'
          actionsInfo: {
            '1': { actions : [],
                   bets    : [] },
            '2': { actions : ['raise-sb'],
                   bets    : [10] },
            '3': { actions : ['raise-bb'],
                   bets    : [25] },
            '4': { actions : ['call'],
                   bets    : [25] }
          },
          positionToAct: 1,
          hasActed : [4],
          betToCall: 25
        }
      }
    };
  }
};
