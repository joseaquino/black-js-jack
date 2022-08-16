// Generate deck of cards
//provide next player card iwht a generator function
import Card from "./Card.js";

export default class Deck {
  constructor() {
    const cardsArrGen = [];
    const clubs = ["clubs", "diamonds", "hearts", "spades"];
    const cards = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    // const cards = ["As", "As", "As", "As", "As", "As", "As", "As", "As", "As"]; //JUST FOR TESTING, REMOVE LATER

    const cardsClubs = clubs.length;
    const differentCards = cards.length;

    for (let i = 0; i < cardsClubs; i++) {
      for (let j = 0; j < differentCards; j++) {
        const card = new Card(clubs[i], cards[j]);
        cardsArrGen.push(card);
      }
    }
    this.deck = cardsArrGen;

    this.generatorCardObject = this.handsGenerator();
  }

  *handsGenerator() {
    while (this.deck.length > 0) {
      let randomIndex = Math.round(Math.random() * (this.deck.length - 1));
      yield this.deck[randomIndex];
      this.deck.splice(randomIndex, 1);
    }
    throw new Error("There are no more cards");
  }

  takeCard() {
    return this.generatorCardObject.next().value;
  }
}
