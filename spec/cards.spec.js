var Card = require("../lib/cards").Card,
    Deck = require("../lib/cards").Deck;

describe("Card class", function() {

    it("should create new instance", function() {
        var cardAS = new Card("A", "S");
        expect( cardAS ).toBeDefined();
    });

    it("should have a toString method", function() {
        var cardAS = new Card("A", "S");
        expect( cardAS.toString() ).toEqual("Ace of Spades");
    });

    it("should validate rank and suit", function() {
        expect( function() { new Card("X", "S"); } ).toThrow(new Error("Invalid Rank/Suit combination"));
        expect( function() { new Card("A", "X"); } ).toThrow("Invalid Rank/Suit combination");
        expect( function() { new Card("X", "X"); } ).toThrow();
    });

});

describe("Deck class", function() {
    var deck, deckCards;
    
    beforeEach(function() {
        deck = new Deck();
        deckCards = deck.cards;
    });
    
    it("should create new instance", function() {
        expect( deck ).toBeDefined();
    });

    it("should have 52 cards", function() {
        expect( deckCards.length ).toEqual(52);
    });

    it("should have a shuffle method", function() {
        deck.shuffle();
        //console.log(deckCards);
        expect( deckCards.length ).toEqual(52);
    });

    it("should have a deal method", function() {
        var dealt;
        deck.shuffle();
        dealt = deck.deal();
        //console.log(dealt);
        //console.log(deckCards);
        expect( dealt ).toBeDefined();
        expect( deckCards.length ).toEqual(51);
    });

});
