// Generate deck of cards
//provide next player card iwht a generator function
import Card from "./Card.js";

export default class Deck {
  constructor() {
    const cardsArrGen = [];
    const clubs = ["clubs", "diamonds", "hearts", "spades"];
    const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    const cardsClubs = clubs.length;
    const differentCards = cards.length;

    for (let i = 0; i < cardsClubs; i++) {
      for (let j = 0; j < differentCards; j++) {
        const card = new Card(clubs[i], cards[j]);
        cardsArrGen.push(card);
      }
    }
    this.deck = cardsArrGen;
  }

  *handsGenerator() {
    while (this.deck.length > 0) {
      let randomIndex = Math.round(Math.random() * (this.deck.length - 1));
      yield this.deck[randomIndex];
      this.deck.splice(randomIndex, 1);
    }
  }
}
