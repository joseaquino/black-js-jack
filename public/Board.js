"use strict";
import { sleepNow } from "./Helpers.js";

import playerDecisionController from "./playerDecisionController.js";
import Player from "./Player.js";
import Deck from "./Deck.js";

export default class Board {
  cardDeck = new Deck();

  constructor() {
    this.players = [];
    this.boardContainerElem = document.querySelector("#game");
    this.boardContainerElem.innerHTML = this.boardHtml();
    this.dealerCont = document.querySelector(".dealer");
    this.playersCont = document.querySelector(".players");
    this.generatorCardObject = this.cardDeck.handsGenerator();
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

  createDealer() {
    const dealer = new Player("Dealer", 2000000, "Dealer");
    dealer.renderPlayerHtml(".dealer");
    //Storing player1 inside players array
    this.addPlayer(dealer);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  async initialCardDealing() {
    const amountOfPlayers = this.players.length;
    const cardsToGive = 2 * amountOfPlayers;
    // const deck = this.deck;
    // const generatorCardObject = this.cardDeck.handsGenerator(deck);

    for (let i = 0; i < cardsToGive; i++) {
      let playerToGetCard = (i + amountOfPlayers) % amountOfPlayers;

      let card = this.generatorCardObject.next().value;

      const currentPlayerBeingDealt = this.players[playerToGetCard];

      if (i === cardsToGive - 1) {
        card.flipCard();
      }

      currentPlayerBeingDealt.receiveCard(card);

      await sleepNow(500);
    }
  }

  clearBoard() {
    this.dealerCont.innerHTML = "";
    this.playersCont.innerHTML = "";
  }

  letPlayersPlay() {
    const playerControls = new playerDecisionController(
      this.players,
      this.generatorCardObject
    );
  }
}
