"use strict";
import { sleepNow } from "./Helpers.js";
import CardsDeck from "./CardsDeck.js";
import Player from "./Player.js";

export default class Board {
  constructor() {
    this.deck = this.cardGeneration(); //Generates deck of cards
    this.mixedDeck = this.mix(this.deck); // Mixes deck of cards
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
        const card = new CardsDeck(clubs[i], cards[j]);
        cardsArrGen.push(card);
      }
    }
    return cardsArrGen;
  }

  mix(arr) {
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
    dealer.setDomElement("Dealer");
    //Storing player1 inside players array
    this.addPlayer(dealer);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }

  async dealCards(cardsArr, playersArr) {
    const amountOfPlayers = playersArr.length;
    const cardsToGive = 2 * amountOfPlayers;

    for (let i = 0; i < cardsToGive; i++) {
      let playerToGetCard = (i + amountOfPlayers) % amountOfPlayers;

      let card = cardsArr.slice(i, i + 1);

      const currentPlayerBeingDealt = playersArr[playerToGetCard];

      if (i === cardsToGive - 1) {
        card[0].flipCard();
      }

      currentPlayerBeingDealt.receiveCard(card);
      currentPlayerBeingDealt.renderCards(card);

      await sleepNow(1000);
    }
  }
}
