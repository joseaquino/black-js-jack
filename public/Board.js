"use strict";
import { sleepNow } from "./Helpers.js";

import Player from "./Player.js";
import Deck from "./Deck.js";
import PlayersBetController from "./PlayersBetController.js";

export default class Board {
  cardDeck = new Deck();

  constructor() {
    this.players = [];
    this.boardContainerElem = document.querySelector("#game");
    this.boardContainerElem.innerHTML = this.boardHtml();
    this.dealerCont = document.querySelector(".dealer");
    this.playersCont = document.querySelector(".players");
    this.betController = new PlayersBetController(this);
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
    const dealer = new Player("Dealer", this, 2000000, "Dealer");
    dealer.renderPlayerHtml(".dealer");
    //Storing player1 inside players array
    this.addPlayer(dealer);
  }

  addPlayer(player) {
    this.players = [...this.players, player];
  }

  async initialCardDealing() {
    const amountOfPlayers = this.players.length;
    const cardsToGive = 2 * amountOfPlayers;

    for (let i = 0; i < cardsToGive; i++) {
      let playerToGetCard = (i + amountOfPlayers) % amountOfPlayers;
      let card = this.cardDeck.takeCard();
      const currentPlayerBeingDealt = this.players[playerToGetCard];

      if (i === cardsToGive - 1) {
        card.flipCard();
      }

      currentPlayerBeingDealt.receiveCard(card);

      await sleepNow(500);
    }
  }

  async startWithGameDealing() {
    await sleepNow(500);
    await this.initialCardDealing();
    this.letPlayersPlay();
  }

  startWithGameBets() {
    this.betController.initBetController();
  }

  letPlayersPlay() {
    this.currentPlayerTurn = 0;
    this.activePlayer = this.players[this.currentPlayerTurn];
    this.updateActivePlayer();
    this.activePlayer.playHands.checkHand();
  }

  clearBoard() {
    this.dealerCont.innerHTML = "";
    this.playersCont.innerHTML = "";
  }

  //CHAGEEEEEES

  nextPlayerWhenPlayingCards() {
    //
    if (this.activePlayer.playerPlayedBothHands)
      this.activePlayer.removeFocusForSecondSplittedCard();

    if (
      this.activePlayer.splitedCards &&
      !this.activePlayer.playerPlayedBothHands
    ) {
      this.activePlayer.removeFocusForFirstSplittedCard();
      this.activePlayer.addFocusForSecondSplittedCard();
      this.activePlayer.playerPlayedBothHands = true;
      return;
    }
    this.activePlayer.playHands.enableDoubleAndSplit();
    //

    this.activePlayer.playHands.finishPlayerTurn();
    this.activePlayer.removeFocus();
    this.currentPlayerTurn++;
    this.updateActivePlayer();
    if (this.isDealerTurn()) {
      this.dealerPlay();
    } else {
      this.activePlayer.playHands.checkHand();
    }
  }

  updateActivePlayer() {
    this.activePlayer = this.players[this.currentPlayerTurn];
    this.activePlayer.addFocus();
  }

  isDealerTurn() {
    this.amountOfPlayers = this.players.length;
    return this.currentPlayerTurn === this.amountOfPlayers - 1;
  }

  dealerPlay() {
    const dealer = this.players[this.amountOfPlayers - 1];
    const secondCard = dealer.secondDealerCard();
    dealer.nextCardToRender = 1;
    dealer.receiveCard(secondCard);

    const mandatoryHittingHandValueLimit = 16;

    while (dealer.handValue <= mandatoryHittingHandValueLimit) {
      const card = this.cardDeck.takeCard();
      this.activePlayer.receiveCard(card);
    }
  }
}
