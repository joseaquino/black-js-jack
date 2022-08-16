"use strict";
//this class is going to create the players
import PlayHand from "./PlayHand.js";

export default class Player {
  domElement = null;

  constructor(playerConfig) {
    this.name = playerConfig.name;
    this.pot = playerConfig.pot;
    this.playerType = playerConfig.playerType;
    this.nextCardToRender = 0;
    this.bet = 0;
    this.board = playerConfig.board;
    this.playHand = new PlayHand(this);
    this.playerPlayedAllHands = false;
    this.hasFinishedTurn = false;
  }

  renderPlayer() {
    this.renderPlayerHtml(".players");
  }

  playerHtml() {
    return `
    <div class="player" id="${this.name}">
      <div class='player__bet-value'></div>
      <h2 class="player-heading">${this.name}</h2>
      <div class="card"></div>
      <div class='player__hand-value'></div>
      </div>
    
    `;
  }

  renderPlayerHtml(containerElement) {
    if (this.domElement) return;
    const htmlPlayersContainer =
      this.board.boardContainerElem.querySelector(containerElement);
    htmlPlayersContainer.insertAdjacentHTML("afterbegin", this.playerHtml());
    this.domElement = htmlPlayersContainer.querySelector(`#${this.name}`);
  }

  receiveCard = (card) => {
    this.playHand.hand.push(card);
    this.playHand.renderNextCard();
    this.playHand.sumOfCards();
    this.playHand.renderHandValue();
  };

  receiveCardforSplitHand(card) {
    if (this.playerPlayedAllHands) {
      this.playHand.secondHand.push(card);
    } else {
      this.playHand.hand.push(card);
    }
    this.playHand.renderCardWhenPlayerHasSplit();
    this.playHand.sumOfCards();
    this.playHand.renderHandValueWhenPlayerHasSplit();

    const handValueLimit = 21;

    if (
      !this.playerPlayedAllHands &&
      this.playHand.hand1Value >= handValueLimit
    )
      this.board.nextPlayerWhenPlayingCards();

    if (this.playerPlayedAllHands && this.playHand.hand2Value >= handValueLimit)
      this.board.nextPlayerWhenPlayingCards();
  }

  secondDealerCard() {
    const secondCard = this.playHand.hand.pop();
    secondCard.flipCard();
    this.domElement.querySelector("#hidden-card").remove();
    return secondCard;
  }

  addFocus() {
    this.domElement.querySelector(".card").classList.add("active");
  }

  addFocusForSecondSplitCard() {
    this.domElement
      .querySelector(`#${this.name} .card`)
      .lastElementChild.classList.add("active");
  }

  removeFocus() {
    this.domElement.querySelector(".card").classList.remove("active");
  }

  removeFocusForFirstSplitCard() {
    this.domElement
      .querySelector(`#${this.name} .card`)
      .firstElementChild.classList.remove("active");
  }

  removeFocusForSecondSplitCard() {
    this.domElement
      .querySelector(`#${this.name} .card`)
      .lastElementChild.classList.remove("active");
  }

  removeFromPot(bet) {
    this.pot -= bet;
  }

  renderBetValue(bet) {
    this.domElement.querySelector(
      ".player__bet-value"
    ).innerHTML = `Betting: ${bet}`;
  }

  setAllHandsAsPlayed() {
    this.playerPlayedAllHands = true;
  }

  //To communicate PlayHand with Board

  finishTurn() {
    this.hasFinishedTurn = true;
    this.board.nextPlayerWhenPlayingCards();
  }

  askForCard() {
    return this.board.cardDeck.takeCard();
  }

  isDealerTurn() {
    return this.board.isDealerTurn();
  }

  //To communicate Board with PlayHand

  checkHand() {
    if (this.playHand.hasPlayer21OrMore()) {
      this.hasFinishedTurn = true;
      return;
    }
    this.playHand.checkHand();
  }

  hasSplitCards() {
    return this.playHand.hasSplitCards;
  }

  removePlayerHandControls() {
    this.playHand.removePlayerHandControls();
  }
}
