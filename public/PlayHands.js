"use strict";
import { sleepNow } from "./Helpers.js";

export default class PlayHands {
  constructor(board) {
    this.board = board;
    this.controlsContainerEle = this.board.boardContainerElem;
  }

  rendnerCotnrols() {
    this.controlsContainerEle.insertAdjacentHTML(
      "beforeend",
      this.controlsHtml()
    );
  }

  controlsHtml() {
    return `
 <div class='player-controls'>
    <button type='button' class='player-controls__btn btn--hitting'> 
    Hit
    </button>  
    <button type='button' class='player-controls__btn btn--standing'> 
    Stand
    </button>
    <button type='button' class='player-controls__btn btn--splitting' disabled> 
    Split
    </button>  
    <button type='button' class='player-controls__btn btn--doubling'> 
    Double down
    </button>      
  </div>`;
  }

  selectingPlayerControls() {
    this.hit = this.controlsContainerEle.querySelector(".btn--hitting");
    this.stand = this.controlsContainerEle.querySelector(".btn--standing");
    this.split = this.controlsContainerEle.querySelector(".btn--splitting");
    this.double = this.controlsContainerEle.querySelector(".btn--doubling");
    this.playerCotrols =
      this.controlsContainerEle.querySelector(".player-controls");
  }

  addingEventListenerToControls() {
    this.hit.addEventListener("click", this.hitting.bind(this));
    this.stand.addEventListener(
      "click",
      this.board.nextPlayerWhenPlayingCards.bind(this.board)
    );
    this.double.addEventListener("click", this.doublingDown);
    this.split.addEventListener("click", this.splitting);
  }

  setUpPlayerControls() {
    this.rendnerCotnrols();
    this.selectingPlayerControls();
    this.addingEventListenerToControls();
  }

  checkHand() {
    if (this.hasPlayer21OrMore()) {
      this.board.nextPlayerWhenPlayingCards();
      return;
    }
    this.setUpPlayerControls();
    if (this.haveSameValuePlayerCards()) {
      this.split.removeAttribute("disabled");
    }
  }

  hasPlayer21OrMore() {
    return this.board.activePlayer.handValue >= 21;
  }

  haveSameValuePlayerCards() {
    const firstPlayerCardValue = this.board.activePlayer.hand[0].value;
    const secondPlayerCardValue = this.board.activePlayer.hand[1].value;
    return firstPlayerCardValue === secondPlayerCardValue;
  }

  hitting(fromDoubling) {
    this.double.setAttribute("disabled", "true");
    this.split.setAttribute("disabled", "true");

    const card = this.board.cardDeck.takeCard();
    if (this.board.activePlayer.splitedCards) {
      this.board.activePlayer.receiveCardforSplittedHand(card);
      return;
    }

    this.board.activePlayer.receiveCard(card);

    if (
      this.hasPlayer21OrMore() &&
      !this.board.isDealerTurn() &&
      fromDoubling !== true
    ) {
      this.board.nextPlayerWhenPlayingCards();
    }
    return;
  }

  splitting = async () => {
    const enoughFoundsforSplitting = await this.betDisplaysplitting();
    if (!enoughFoundsforSplitting) return;

    this.double.setAttribute("disabled", "true");
    this.board.activePlayer.splitedCards = true;
    // this.fromSplittig = true; This seems that does not do anything

    this.removeValueOfOriginalHandWhenSplitting();
    this.cardSplitting();
    this.setValueOfSplittedHands();
  };

  cardSplitting = () => {
    const playerCont = this.controlsContainerEle.querySelector(
      `#${this.board.activePlayer.name} .card`
    );

    const cardContainerElem =
      this.controlsContainerEle.querySelector(".card.active");
    const firstPlayerCard = cardContainerElem.lastChild;
    const secondPlayerCard = cardContainerElem.firstChild;

    //definiendo 2 manos para el jugador que hace el split
    this.createSplitHandProperties();

    this.board.activePlayer.removeFocus();

    playerCont.innerHTML = `
    <div class="card active">
    ${firstPlayerCard.outerHTML}
    <div class='player__hand-value'></div>
    </div>
    <div class="card">
    ${secondPlayerCard.outerHTML}
    <div class='player__hand-value'></div>
    </div>
    `;
  };

  createSplitHandProperties() {
    this.board.activePlayer.secondHand =
      this.board.activePlayer.hand.splice(-1);
    this.board.activePlayer.nextCardToRenderHand1 = 1;
    this.board.activePlayer.nextCardToRenderHand2 = 1;
    this.board.activePlayer.hand1Value = this.board.activePlayer.hand[0].value;
    this.board.activePlayer.hand2Value =
      this.board.activePlayer.secondHand[0].value;
  }

  betDisplaysplitting = async () => {
    const bettingCont = this.controlsContainerEle.querySelector(
      `#${this.board.activePlayer.name} .player__bet-value`
    );
    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = betValueStr * 1; //converting string to number
    const remainingAfterDoubling = this.board.activePlayer.pot - betValueNum;
    this.split.setAttribute("disabled", "true");

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");

      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      // this.double.setAttribute("disabled", "true"); Seems that does not do anything
      return false;
    }

    this.board.activePlayer.pot -= betValueNum;
    bettingCont.innerHTML = `<div>Betting hand 1: ${betValueNum}</div>
                             <div>Betting hand 2: ${betValueNum}</div>`;

    return true;
  };

  removeValueOfOriginalHandWhenSplitting = () => {
    const sumContainer = this.controlsContainerEle.querySelector(
      `#${this.board.activePlayer.name} .player__hand-value`
    );
    sumContainer.innerHTML = "";
  };

  setValueOfSplittedHands = () => {
    const sumContainerHand1 = this.controlsContainerEle.querySelector(
      `#${this.board.activePlayer.name} .card.active .player__hand-value`
    );
    sumContainerHand1.innerHTML = this.board.activePlayer.hand1Value;
    const sumContainerHand2 = this.controlsContainerEle
      .querySelector(`#${this.board.activePlayer.name} .card`)
      .lastElementChild.querySelector(".player__hand-value");
    sumContainerHand2.innerHTML = this.board.activePlayer.hand2Value;
  };

  doublingDown = async () => {
    const bettingCont = this.controlsContainerEle.querySelector(
      `#${this.board.activePlayer.name} .player__bet-value`
    );

    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = Number(betValueStr); //converting string to number
    const remainingAfterDoubling = this.board.activePlayer.pot - betValueNum;

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");
      this.double.setAttribute("disabled", "true");
      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      this.double.setAttribute("disabled", "true");
      return;
    }

    this.board.activePlayer.pot -= betValueNum;
    bettingCont.innerHTML = `Betting: ${betValueNum * 2}`; //doubling betValueNum;
    this.double.setAttribute("disabled", "true");

    this.hitting(true);
    this.board.nextPlayerWhenPlayingCards();
  };

  finishPlayerTurn() {
    this.controlsContainerEle.querySelector(".player-controls")?.remove();
  }

  enableDoubleAndSplit = () => {
    this.double?.removeAttribute("disabled");
    this.split?.removeAttribute("disabled");
  };
}
