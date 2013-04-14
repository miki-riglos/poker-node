var _ = require('underscore');

var keys = Object.keys;

var ranks = {
  '2' : {name: 'Two',   value:  2},
  '3' : {name: 'Three', value:  3},
  '4' : {name: 'Four',  value:  4},
  '5' : {name: 'Five',  value:  5},
  '6' : {name: 'Six',   value:  6},
  '7' : {name: 'Seven', value:  7},
  '8' : {name: 'Eight', value:  8},
  '9' : {name: 'Nine',  value:  9},
  '10': {name: 'Ten',   value: 10},
  'J' : {name: 'Jack',  value: 11},
  'Q' : {name: 'Queen', value: 12},
  'K' : {name: 'King',  value: 13},
  'A' : {name: 'Ace',   value: 14}
};

var suits = {
  'C': {name: 'Clubs'},
  'D': {name: 'Diamonds'},
  'H': {name: 'Hearts'},
  'S': {name: 'Spades'}
};


// Card class
function Card(rank, suit) {
  if (!ranks[rank] || !suits[suit]) {
    throw new Error('Invalid Rank/Suit combination');
  }
  this.rank = rank;
  this.suit = suit;

  this.value = ranks[this.rank].value;
}

Card.prototype.toJSON = function () {
  return _.omit(this, ['value']);
};

Card.deserialize = function(stringified) {
  var object   = JSON.parse(stringified);
  var instance = new Card(object.rank, object.suit);
  return instance;
};


// Deck initial state
function getDeckInitialState() {
  var deckInitialState = {};
  keys(suits).forEach(function(suitKey) {
    keys(ranks).forEach(function(rankKey) {
      deckInitialState[keys(deckInitialState).length] = new Card(rankKey, suitKey);
    });
  });
  return deckInitialState;
}

// Deck class
function Deck(state) {
  var self = this;
  state = state || getDeckInitialState();
  keys(state).forEach(function(key) {
    self.push( new Card(state[key].rank, state[key].suit) );
  });
}

Deck.prototype = [];

Deck.prototype.shuffle = function() {
  var index, swap, temp;
  for (index = 0; index < this.length; index++) {
    swap = Math.floor(Math.random() * this.length);
    temp = this[index];
    this[index] = this[swap];
    this[swap] = temp;
  }
  return this;
};

Deck.prototype.deal = function() {
  return this.shift();
};

Deck.prototype.toJSON = function () {
  return _.omit(this, ['length']);
};

Deck.deserialize = function(stringified) {
  var object   = JSON.parse(stringified);
  var instance = new Deck(object);
  return instance;
};

// Exports
module.exports = {
  Card: Card,
  Deck: Deck
};
