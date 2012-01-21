var Card = require("../lib/cards").Card,
    Deck = require("../lib/cards").Deck;

describe("Card class", function() {

    it("should create new instance", function() {
        var cardAceOfSpades  = new Card("A", "S");
        expect( cardAceOfSpades ).toBeInstanceOf( Card );
    });

    it("should have a toString method", function() {
        var cardAceOfSpades  = new Card("A", "S");
        expect( cardAceOfSpades.toString() ).toEqual("Ace of Spades");
    });

    it("should validate rank and suit", function() {
        expect( function() { new Card("X", "S"); } ).toThrow(new Error("Invalid Rank/Suit combination"));
        expect( function() { new Card("A", "X"); } ).toThrow("Invalid Rank/Suit combination");
        expect( function() { new Card("X", "X"); } ).toThrow();
    });

});

describe("Deck class", function() {
    var deck;

    beforeEach(function() {
        deck = new Deck();
    });

    it("should create new instance", function() {
        expect( deck ).toBeInstanceOf( Deck );
    });

    it("should inherit from array", function() {
        expect( deck ).toBeInstanceOf( Array );
    });

    it("should have 52 cards", function() {
        expect( deck.length ).toEqual(52);
    });

    it("should have a shuffle method", function() {
        deck.shuffle();
        //console.log(deck);
        expect( deck.length ).toEqual(52);
    });

    it("should have a deal method", function() {
        var dealt;
        deck.shuffle();
        dealt = deck.deal();
        //console.log(dealt);
        //console.log(deck);
        expect( dealt ).toBeDefined();
        expect( deck.length ).toEqual(51);
    });

});
