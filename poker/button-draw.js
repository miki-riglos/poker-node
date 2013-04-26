/*
  var draw = {
    winner: 1,
    cards : [
      { round: 1,
        dealt: [ {position: 1, card: {rank: '5', suit: 'S', value: 5} },
                 {position: 2, card: {rank: '2', suit: 'S', value: 2} },
                 {position: 3, card: {rank: '5', suit: 'H', value: 5} } ] },
      { round: 2,
        dealt: [ {position: 1, card: {rank: '9', suit: 'D', value: 9} },
                 {position: 3, card: {rank: '7', suit: 'D', value: 7} } ] }
    ]
  };
*/
function buttonDraw(positions, deck) {
  var roundCounter = 0,
      draw          = { winner: 0, cards: [] },
      tiedPositions = positions,
      currentCard,
      dealt,
      maxVal,
      winners;

  while (!draw.winner) {
    ++roundCounter;
    dealt = [];
    maxVal = 0;

    tiedPositions.forEach(function(position) {
      currentCard = deck.deal();
      dealt.push( {position: position, card: currentCard} );
      if (currentCard.value > maxVal) maxVal = currentCard.value;
    });

    draw.cards.push( {round: roundCounter, dealt: dealt} );

    winners = dealt.filter( function(item) { return item.card.value === maxVal} )
                   .map( function(item) { return item.position} ) ;
    if (winners.length > 1) {
      tiedPositions = winners;
    } else {
      draw.winner = winners[0];
    }
  }

  return draw;
}


// Exports
module.exports = buttonDraw;
