/*global describe, it, before, beforeEach, afterEach, after*/

var buttonDraw = require('../../poker/button-draw'),
    Card = require('../../poker/deck').Card,
    Deck = require('../../poker/deck').Deck;

describe('buttonDraw function', function() {
  var deck;

  beforeEach(function() {
    deck = Deck();
  });

  it('should assign button in the 1st round', function() {
    var positions = [1, 2, 3];

    deck.unshift( Card('2', 'S'),
                  Card('A', 'C'),
                  Card('Q', 'S') );

    var draw = buttonDraw(positions, deck);

    draw.winner.should.equal(2);
    draw.cards.should.have.length(1);
  });

  it('should assign button in the 2nd round', function() {
    var positions = [1, 2, 3];

    deck.unshift( Card('5', 'S'),
                  Card('2', 'S'),
                  Card('5', 'H'),
                  Card('9', 'D'),
                  Card('7', 'D') );

    var draw = buttonDraw(positions, deck);

    draw.winner.should.equal(1);
    draw.cards.should.have.length(2);
  });

});