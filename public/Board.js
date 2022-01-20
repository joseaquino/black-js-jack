"use strict";
import { sleepNow } from "./Helpers.js";
import Card from "./Card.js";
import Player from "./Player.js";

export default class Board {
  constructor() {
    this.deck = this.cardGeneration(); //Generates deck of cards
    this.shuffledDeck = this.shuffle(this.deck); // Shuffle deck of cards
    this.players = [];
  }

  cardGeneration() {
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
    return cardsArrGen;
  }

  shuffle(arr) {
    const arrCopy = [...arr];

    let totalOfElements = arrCopy.length;
    let randomIndex;

    while (totalOfElements !== 0) {
      //generating a random number between 0 and last array element, [0, lastElement], inclusive
      randomIndex = Math.round(Math.random() * (totalOfElements - 1));
      totalOfElements--;

      //changing last element with random index
      let tempVariable = arrCopy[totalOfElements];
      arrCopy[totalOfElements] = arrCopy[randomIndex];
      arrCopy[randomIndex] = tempVariable;
    }
    return arrCopy;
  }

  dealerCreation() {
    const dealer = new Player("Dealer", 2000000, "Dealer");
    dealer.renderPlayerHtml(".dealer");
    //Storing player1 inside players array
    this.addPlayer(dealer);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  async dealCards() {
    const amountOfPlayers = this.players.length;
    const cardsToGive = 2 * amountOfPlayers;

    for (let i = 0; i < cardsToGive; i++) {
      let playerToGetCard = (i + amountOfPlayers) % amountOfPlayers;

      let [card] = this.shuffledDeck.slice(i, i + 1);

      const currentPlayerBeingDealt = this.players[playerToGetCard];

      if (i === cardsToGive - 1) {
        card.flipCard();
      }

      currentPlayerBeingDealt.receiveCard(card);

      await sleepNow(1000);
    }
  }
}
