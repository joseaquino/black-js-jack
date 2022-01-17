function cardGeneration() {
  const cardsArrGen = [];
  const clubs = ["clubs", "diamonds", "hearts", "spades"];
  const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

  const cardsClubs = clubs.length;
  const differentCards = cards.length;

  for (let i = 0; i < cardsClubs; i++) {
    for (let j = 0; j < differentCards; j++) {
      const cardObj = {
        suit: clubs[i],
        number: cards[j],
        color: clubs[i] === "hearts" || clubs[i] === "spades" ? "red" : "black",
        face: "up",
      };

      switch (cardObj.suit) {
        case "clubs":
          cardObj.icon = "fab fa-canadian-maple-leaf";
          break;
        case "diamonds":
          cardObj.icon = "fas fa-gem";
          break;
        case "hearts":
          cardObj.icon = "fas fa-heart";
          break;
        case "spades":
          cardObj.icon = "fas fa-candy-cane";
          break;
      }

      cardsArrGen.push(cardObj);
    }
  }
  return cardsArrGen;
}

export { cardGeneration };
