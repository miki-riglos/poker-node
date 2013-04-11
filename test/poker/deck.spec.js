/*global describe, it, before, beforeEach, afterEach, after*/

var Card = require('../../poker/deck').Card,
    Deck = require('../../poker/deck').Deck;

describe('Card class', function() {

  it('should create new instance', function() {
    var cardAceOfSpades = new Card('A', 'S');
    cardAceOfSpades.should.be.an.instanceOf(Card);
  });

  it('should validate rank and suit', function() {
    ( function() { new Card('X', 'S'); } ).should.throwError('Invalid Rank/Suit combination');
    ( function() { new Card('A', 'X'); } ).should.throwError('Invalid Rank/Suit combination');
    ( function() { new Card('X', 'X'); } ).should.throwError();
  });

  it('should serialize and deserialize', function() {
    var cardAceOfSpades = new Card('A', 'S');
    var stringified = cardAceOfSpades.serialize();
    var cardInstance = Card.deserialize(stringified);
    cardInstance.should.be.an.instanceOf(Card);
    cardInstance.should.eql(cardAceOfSpades);
  });

});

describe('Deck class', function() {
  var deck;

  beforeEach(function() {
    deck = new Deck();
  });

  it('should create new instance', function() {
    deck.should.be.an.instanceOf(Deck);
  });

  it('should inherit from array', function() {
    deck.should.be.an.instanceOf(Array);
  });

  it('should have 52 cards', function() {
    deck.length.should.equal(52);
  });

  it('should have a shuffle method', function() {
    deck.shuffle();
    deck.length.should.equal(52);
  });

  it('should have a deal method', function() {
    var dealt;
    deck.shuffle();
    dealt = deck.deal();
    dealt.should.be.an.instanceOf(Card);
    deck.length.should.equal(51);
  });

  it('should serialize and deserialize', function() {
    var stringified = deck.serialize();
console.log(stringified)    ;
    var deckInstance = Deck.deserialize(stringified);
    deckInstance.should.be.an.instanceOf(Deck);
    deckInstance[0].should.be.an.instanceOf(Card);
    deckInstance.should.eql(deck);
  });

});
