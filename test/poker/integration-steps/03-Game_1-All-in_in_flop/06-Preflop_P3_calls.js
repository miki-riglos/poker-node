module.exports = {

  name: 'Player 3 (Sofia) calls',

  getInitialState: require('./05-Preflop_P2_calls').getFinalState,

  forward: function(tournament) {
    tournament.players[3].calls();
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
        '1': { name: 'Miki',    chips:  8975 },
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
                 totalBet: 1025 },
          '2': { hand    : [ {rank: '4', suit: 'C'}, {rank: '8', suit: 'C'} ],
                 folded  : false,
                 totalBet: 1025 },
          '3': { hand    : [ {rank: '5', suit: 'C'}, {rank: '9', suit: 'C'} ],
                 folded  : false,
                 totalBet: 1025 },
          '4': { hand    : [ {rank: '6', suit: 'C'}, {rank: '10', suit: 'C'} ],
                 folded  : false,
                 totalBet: 25 }
        },
        pot: 3100,
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
          number: 1,    // 'preflop'
          actionsInfo: {
            '1': { actions : ['raise'],
                   bets    : [1025] },
            '2': { actions : ['raise-sb', 'call'],
                   bets    : [10, 1015] },
            '3': { actions : ['raise-bb', 'call'],
                   bets    : [25, 1000] },
            '4': { actions : ['call'],
                   bets    : [25] }
          },
          positionToAct: 4,
          hasActed : [1, 2, 3],
          betToCall: 1025
        }
      }
    };
  }
};
