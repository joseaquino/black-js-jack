"use strict";
//this class is going to create the players
import PlayHand from "./PlayHand.js";

export default class Player {
  domElement = null;

  constructor(confingObject) {
    this.hand = [];
    this.name = confingObject.name;
    this.pot = confingObject.pot;
    this.playerType = confingObject.playerType;
    this.nextCardToRender = 0;
    this.bet = 0;
    this.board = confingObject.board;
    this.playHand = new PlayHand(this);
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
    const htmlPlayersContainer = document.querySelector(containerElement);
    htmlPlayersContainer.insertAdjacentHTML("afterbegin", this.playerHtml());
    this.domElement = htmlPlayersContainer.querySelector(`#${this.name}`);
  }

  receiveCard = (card) => {
    this.hand.push(card);
    this.playHand.renderNextCard();
    this.playHand.sumOfCards();
    this.playHand.renderHandValue();
  };

  receiveCardforSplittedHand(card) {
    if (this.playerPlayedAllHands) {
      this.playHand.secondHand.push(card);
    } else {
      this.hand.push(card);
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
    const secondCard = this.hand.pop();
    secondCard.flipCard();
    this.domElement.querySelector("#hidden-card").remove();
    return secondCard;
  }

  addFocus() {
    this.domElement.querySelector(".card").classList.add("active");
  }

  addFocusForSecondSplittedCard() {
    this.domElement
      .querySelector(`#${this.name} .card`)
      .lastElementChild.classList.add("active");
  }

  removeFocus() {
    this.domElement.querySelector(".card").classList.remove("active");
  }

  removeFocusForFirstSplittedCard() {
    this.domElement
      .querySelector(`#${this.name} .card`)
      .firstElementChild.classList.remove("active");
  }

  removeFocusForSecondSplittedCard() {
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

  hasPlayedAllHands() {
    this.playerPlayedAllHands = true;
  }

  //To communicate PlayHand with Board

  finishTurn() {
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
    this.playHand.checkHand();
  }

  hasSplitCards() {
    return this.playHand.hasSplitCards;
  }

  enableDoubleAndSplit() {
    this.playHand.enableDoubleAndSplit();
  }

  removePlayerControls() {
    this.playHand.removePlayerControls();
  }
}
