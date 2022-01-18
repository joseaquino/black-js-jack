class Card {
  faceDirection = "up";

  constructor(suit, number) {
    this.suit = suit;
    this.number = number;
    this.color = suit === "hearts" || suit === "spades" ? "red" : "black";
    this.selectCardIcon()
  }

  selectCardIcon() {
    switch (this.suit) {
      case "clubs":
        this.icon = "fab fa-canadian-maple-leaf";
        break;
      case "diamonds":
        this.icon = "fas fa-gem";
        break;
      case "hearts":
        this.icon = "fas fa-heart";
        break;
      case "spades":
        this.icon = "fas fa-candy-cane";
        break;
    }
  }

  flipCard() {
    if (this.faceDirection === "up") {
      this.faceDirection = "down"
    } else {
      this.faceDirection = "up"
    }
  }
}

function cardGeneration() {
  const cardsArrGen = [];
  const clubs = ["clubs", "diamonds", "hearts", "spades"];
  const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

  const cardsClubs = clubs.length;
  const differentCards = cards.length;

  for (let i = 0; i < cardsClubs; i++) {
    for (let j = 0; j < differentCards; j++) {
      const card = new Card(clubs[i], cards[j])
      cardsArrGen.push(card);
    }
  }
  return cardsArrGen;
}

export { cardGeneration };
