"use strict";
import { sleepNow } from "./Helpers.js";

import Player from "./Player.js";
import Deck from "./Deck.js";

export default class Board {
  cardDeck = new Deck();

  constructor() {
    this.deck = this.cardDeck.cardGeneration(); //Generates deck of cards
    this.players = [];
    this.boardContainerElem = document.querySelector("#game");
    this.boardContainerElem.innerHTML = this.boardHtml();
    this.obj = [1, 3, 4];
    this.dealerCont = document.querySelector(".dealer");
    this.playersCont = document.querySelector(".players");
  }

  boardHtml() {
    return `
          <h1 class="header">Black Jack</h1>
      <div class="players-container">
        <div class="dealer"></div>
        <div class="players"></div>
      </div>
        `;
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
    const deck = this.deck;
    const generatorCardObject = this.cardDeck.handsGenerator(deck);

    for (let i = 0; i < cardsToGive; i++) {
      let playerToGetCard = (i + amountOfPlayers) % amountOfPlayers;

      let card = generatorCardObject.next().value;

      const currentPlayerBeingDealt = this.players[playerToGetCard];

      if (i === cardsToGive - 1) {
        card.flipCard();
      }

      currentPlayerBeingDealt.receiveCard(card);

      await sleepNow(1000);
    }
  }

  clearBoard() {
    this.dealerCont.innerHTML = "";
    this.playersCont.innerHTML = "";
  }
}
