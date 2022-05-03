"use strict";
import { sleepNow } from "./Helpers.js";

export default class playerDecisionController {
  constructor({ players, generatorCardObject }) {
    if (!Array.isArray(players)) {
      throw new Error(
        `You must provider an array with the players to the playerDecisionController constructor`
      );
    }

    this.controlsContainerEle = document.querySelector("#game");
    this.controlsContainerEle.insertAdjacentHTML(
      "beforeend",
      this.controlsHtml()
    );

    this.hit = this.controlsContainerEle.querySelector(".btn--hitting");
    this.stand = this.controlsContainerEle.querySelector(".btn--standing");
    this.split = this.controlsContainerEle.querySelector(".btn--splitting");
    this.double = this.controlsContainerEle.querySelector(".btn--doubling");
    this.playerCotrols =
      this.controlsContainerEle.querySelector(".player-controls");

    this.hit.addEventListener("click", this.hitting.bind(this));
    this.stand.addEventListener("click", this.standing.bind(this));
    this.double.addEventListener("click", this.doublingDown);
    this.split.addEventListener("click", this.splitting);

    this.players = players;
    this.amountOfPlayers = this.players.length;
    this.generatorCardObject = generatorCardObject;
    this.currentPlayerTurn = this.definePlayerTurn();
    this.activePlayer = this.players[this.currentPlayerTurn];
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

  definePlayerTurn() {
    let currentPlayerTurn = 0;
    for (let player of this.players) {
      if (player.handValue === 21) currentPlayerTurn++;
      else {
        this.activePlayer = this.players[currentPlayerTurn];
        if (this.haveSameValuePlayerCards()) {
          this.split.removeAttribute("disabled");
        }
        document
          .querySelector(`#${this.players[currentPlayerTurn].name}`)
          .querySelector(".card")
          .classList.add("active");
        return currentPlayerTurn;
      }
    }
  }

  haveSameValuePlayerCards() {
    return this.activePlayer.hand[0].value === this.activePlayer.hand[0].value;
  }

  hasPlayer21() {
    return this.activePlayer.handValue === 21;
  }

  hasPlayerMoreThan21() {
    return this.activePlayer.handValue >= 21;
  }

  isDealerTurn() {
    return this.currentPlayerTurn === this.amountOfPlayers - 1;
  }

  dealerPlay() {
    this.double.setAttribute("disabled", "true");
    this.stand.setAttribute("disabled", "true");
    this.hit.setAttribute("disabled", "true");
    const dealer = this.players[this.amountOfPlayers - 1];
    const secondCard = dealer.secondDealerCard();
    dealer.nextCardToRender = 1;
    dealer.receiveCard(secondCard);

    while (dealer.handValue <= 16) {
      this.hitting();
    }

    if (dealer.handValue >= 17) return;
  }

  nextPlayer() {
    if (this.activePlayer.playerPlayedBothHands)
      document
        .querySelector(`#${this.activePlayer.name} .card`)
        .lastElementChild.classList.remove("active");

    if (
      this.activePlayer.splitedCards &&
      !this.activePlayer.playerPlayedBothHands
    ) {
      document
        .querySelector(`#${this.activePlayer.name} .card`)
        .firstElementChild.classList.remove("active");
      document
        .querySelector(`#${this.activePlayer.name} .card`)
        .lastElementChild.classList.add("active");
      this.activePlayer.playerPlayedBothHands = true;
      return;
    }
    this.double.removeAttribute("disabled");
    this.split.removeAttribute("disabled");
    document
      .querySelector(`#${this.activePlayer.name}`)
      .querySelector(".card")
      .classList.remove("active");

    this.currentPlayerTurn++;
    this.activePlayer = this.players[this.currentPlayerTurn];
    if (this.hasPlayer21() && !this.isDealerTurn()) this.currentPlayerTurn++;
    document
      .querySelector(`#${this.activePlayer.name}`)
      .querySelector(".card")
      .classList.add("active");

    if (this.isDealerTurn()) {
      this.dealerPlay();
      return;
    }

    return;
  }

  dealCard() {
    return this.generatorCardObject.next().value;
  }

  doublingDown = async () => {
    const bettingCont = document.querySelector(
      `#${this.activePlayer.name} .player__bet-value`
    );
    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = betValueStr * 1; //converting string to number
    const remainingAfterDoubling = this.activePlayer.pot - betValueNum;

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");
      this.double.setAttribute("disabled", "true");
      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      this.double.setAttribute("disabled", "true");
      return;
    }

    this.activePlayer.pot -= betValueNum;
    bettingCont.innerHTML = `Betting: ${betValueNum * 2}`; //doubling betValueNum;
    this.double.setAttribute("disabled", "true");

    this.hitting(true);
    this.nextPlayer();
  };

  hitting(fromDoubling) {
    this.double.setAttribute("disabled", "true");
    this.split.setAttribute("disabled", "true");
    const card = this.dealCard();
    if (this.activePlayer.splitedCards) {
      this.activePlayer.receiveCardforSplittedHand(card);
      return;
    }

    this.activePlayer.receiveCard(card);

    if (
      (this.hasPlayerMoreThan21() || this.hasPlayer21()) &&
      !this.isDealerTurn() &&
      fromDoubling !== true
    )
      this.nextPlayer();
    return;
  }

  standing() {
    this.nextPlayer();
  }

  splitting = async () => {
    const enoughFoundsforSplitting = await this.betDisplaysplitting();
    if (!enoughFoundsforSplitting) return;

    this.double.setAttribute("disabled", "true");

    this.activePlayer.splitedCards = true;
    this.fromSplittig = true;

    this.removeValueOfOriginalHandWhenSplitting();
    this.cardSplitting();
    this.setValueOfSplittedHands();
  };

  cardSplitting = () => {
    const playerCont = document
      .querySelector(`#${this.activePlayer.name}`)
      .querySelector(".card");
    const cardContainerElem = document.querySelector(".card.active");
    const firstPlayerCard = cardContainerElem.lastChild;
    const secondPlayerCard = cardContainerElem.firstChild;

    //definiendo 2 manos para el jugador que hace el split
    this.activePlayer.secondHand = this.activePlayer.hand.splice(-1);
    this.activePlayer.nextCardToRenderHand1 = 1;
    this.activePlayer.nextCardToRenderHand2 = 1;
    this.activePlayer.hand1Value = this.activePlayer.hand[0].value;
    this.activePlayer.hand2Value = this.activePlayer.secondHand[0].value;

    document
      .querySelector(`#${this.activePlayer.name}`)
      .querySelector(".card")
      .classList.remove("active");

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

  betDisplaysplitting = async () => {
    const bettingCont = document.querySelector(
      `#${this.activePlayer.name} .player__bet-value`
    );
    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = betValueStr * 1; //converting string to number
    const remainingAfterDoubling = this.activePlayer.pot - betValueNum;
    this.split.setAttribute("disabled", "true");

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");

      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      // this.double.setAttribute("disabled", "true");
      return false;
    }

    this.activePlayer.pot -= betValueNum;
    bettingCont.innerHTML = `<div>Betting hand 1: ${betValueNum}</div>
                             <div>Betting hand 2: ${betValueNum}</div>`;

    return true;
  };

  removeValueOfOriginalHandWhenSplitting = () => {
    const sumContainer = document.querySelector(
      `#${this.activePlayer.name} .player__hand-value`
    );
    sumContainer.innerHTML = "";
  };

  setValueOfSplittedHands = () => {
    const sumContainerHand1 = document.querySelector(
      `#${this.activePlayer.name} .card.active .player__hand-value`
    );
    sumContainerHand1.innerHTML = this.activePlayer.hand1Value;
    const sumContainerHand2 = document
      .querySelector(`#${this.activePlayer.name} .card`)
      .lastElementChild.querySelector(".player__hand-value");
    sumContainerHand2.innerHTML = this.activePlayer.hand2Value;
  };
}
