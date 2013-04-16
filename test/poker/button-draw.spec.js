/*global describe, it, before, beforeEach, afterEach, after*/

var buttonDraw = require('../../poker/button-draw'),
    Card = require('../../poker/deck').Card,
    Deck = require('../../poker/deck').Deck;

describe('buttonDraw function', function() {
  var deck;

  beforeEach(function() {
    deck = new Deck();
  });

  it('should assign button in the 1st round', function() {
    var positions = [1, 2, 3];

    deck.unshift( new Card('2', 'S'),
                  new Card('A', 'C'),
                  new Card('Q', 'S') );

    var draw = buttonDraw(positions, deck);

    draw.winner.should.equal(2);
    draw.cards.should.have.length(1);
  });

  it('should assign button in the 2nd round', function() {
    var positions = [1, 2, 3];

    deck.unshift( new Card('5', 'S'),
                  new Card('2', 'S'),
                  new Card('5', 'H'),
                  new Card('9', 'D'),
                  new Card('7', 'D') );

    var draw = buttonDraw(positions, deck);

    draw.winner.should.equal(1);
    draw.cards.should.have.length(2);
  });

});