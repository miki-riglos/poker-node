/*global describe, it, before, beforeEach, afterEach, after*/

var Card = require('../../poker/deck').Card,
    Deck = require('../../poker/deck').Deck;

describe('Card class', function() {

  it('should create new instance', function() {
    var cardAceOfSpades  = Card('A', 'S');
    cardAceOfSpades.should.be.an.instanceOf(Card);
  });

  it('should have a toString method', function() {
    var cardAceOfSpades  = Card('A', 'S');
    cardAceOfSpades.toString().should.equal('Ace of Spades');
  });

  it('should validate rank and suit', function() {
    ( function() { Card('X', 'S'); } ).should.throwError('Invalid Rank/Suit combination');
    ( function() { Card('A', 'X'); } ).should.throwError('Invalid Rank/Suit combination');
    ( function() { Card('X', 'X'); } ).should.throwError();
  });

});

describe('Deck class', function() {
  var deck;

  beforeEach(function() {
    deck = Deck();
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

});
