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

var keys = Object.keys;

// Card class
function Card(rank, suit) {
  if (!ranks[rank] || !suits[suit]) {
    throw new Error('Invalid Rank/Suit combination');
  }
  this.rank = rank;
  this.suit = suit;

  this.value = ranks[this.rank].value;
}

Card.prototype.serialize = function() {
  var exclusions = ['value'];
  var stringified = JSON.stringify(this, function(key, value) { return exclusions.indexOf(key) != -1 ? undefined : value }, 2);
  return stringified;
};

Card.deserialize = function(stringified) {
  var object   = JSON.parse(stringified);
  var instance = new Card(object.rank, object.suit);
  return instance;
};


// Deck class
function Deck() {
  var self = this;
  keys(suits).forEach( function(suitKey) {
    keys(ranks).forEach( function(rankKey) {
      self.push( new Card(rankKey, suitKey) );
    });
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

Deck.prototype.serialize = function() {
  var exclusions = ['length'];
  var stringified = JSON.stringify(this, function(key, value) { return exclusions.indexOf(key) != -1 ? undefined : value }, 2);
  return stringified;
};

Deck.deserialize = function(stringified) {
  var object   = JSON.parse(stringified);
  var instance = new Card(object.rank, object.suit);
  return instance;
};

// Exports
module.exports = {
  Card: Card,
  Deck: Deck
};
