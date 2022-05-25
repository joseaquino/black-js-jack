"use strict";
import { sleepNow } from "./Helpers.js";

export default class PlayHand {
  constructor(player) {
    this.player = player;
    this.controlsContainerEle = document.querySelector("#game");
    this.hasSplitCards = false;
  }

  rendnerControls() {
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

  selectPlayerControls() {
    this.hit = this.controlsContainerEle.querySelector(".btn--hitting");
    this.stand = this.controlsContainerEle.querySelector(".btn--standing");
    this.split = this.controlsContainerEle.querySelector(".btn--splitting");
    this.double = this.controlsContainerEle.querySelector(".btn--doubling");
    this.playerCotrols =
      this.controlsContainerEle.querySelector(".player-controls");
  }

  addEventListenerToControls() {
    this.hit.addEventListener("click", this.hitCard.bind(this));
    this.stand.addEventListener(
      "click",
      this.player.finishTurn.bind(this.player)
    );
    this.double.addEventListener("click", this.doubleDownBet);
    this.split.addEventListener("click", this.splitCards);
  }

  setUpPlayerControls() {
    this.rendnerControls();
    this.selectPlayerControls();
    this.addEventListenerToControls();
  }

  checkHand() {
    if (this.hasPlayer21OrMore()) {
      this.player.finishTurn();
      return;
    }
    this.setUpPlayerControls();
    if (this.havePlayerCardsSameValue()) {
      this.split.removeAttribute("disabled");
    }
  }

  hasPlayer21OrMore() {
    return this.player.handValue >= 21;
  }

  havePlayerCardsSameValue() {
    const firstPlayerCardValue = this.player.hand[0].value;
    const secondPlayerCardValue = this.player.hand[1].value;
    return firstPlayerCardValue === secondPlayerCardValue;
  }

  hitCard(fromDoubling) {
    this.double.setAttribute("disabled", "true");
    this.split.setAttribute("disabled", "true");

    const card = this.player.askForCard();
    if (this.hasSplitCards) {
      this.player.receiveCardforSplittedHand(card);
      return;
    }

    this.player.receiveCard(card);

    if (
      this.hasPlayer21OrMore() &&
      !this.player.isDealerTurn() &&
      fromDoubling !== true
    ) {
      this.player.finishTurn();
    }
    return;
  }

  splitCards = async () => {
    const enoughFoundsforSplitting = await this.displaySplitHandBetValues();
    if (!enoughFoundsforSplitting) return;

    this.double.setAttribute("disabled", "true");
    this.hasSplitCards = true;

    this.removeValueOfOriginalHandWhenSplitting();
    this.separateCards();
    this.setValueOfSplitHands();
  };

  separateCards = () => {
    const playerCont = this.controlsContainerEle.querySelector(
      `#${this.player.name} .card`
    );

    const cardContainerElem =
      this.controlsContainerEle.querySelector(".card.active");
    const firstPlayerCard = cardContainerElem.lastChild;
    const secondPlayerCard = cardContainerElem.firstChild;

    this.createSplitHandProperties();

    this.player.removeFocus();

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

  //some important changes

  createSplitHandProperties() {
    this.secondHand = this.player.hand.splice(-1);
    this.nextCardToRenderHand1 = 1;
    this.nextCardToRenderHand2 = 1;
    this.hand1Value = this.player.hand[0].value;
    this.hand2Value = this.secondHand[0].value;
  }

  displaySplitHandBetValues = async () => {
    const bettingCont = this.controlsContainerEle.querySelector(
      `#${this.player.name} .player__bet-value`
    );
    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = betValueStr * 1; //converting string to number
    const remainingAfterDoubling = this.player.pot - betValueNum;
    this.split.setAttribute("disabled", "true");

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");

      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      // this.double.setAttribute("disabled", "true"); Seems that does not do anything
      return false;
    }

    this.player.pot -= betValueNum;
    bettingCont.innerHTML = `<div>Betting hand 1: ${betValueNum}</div>
                             <div>Betting hand 2: ${betValueNum}</div>`;

    return true;
  };

  removeValueOfOriginalHandWhenSplitting = () => {
    const sumContainer = this.controlsContainerEle.querySelector(
      `#${this.player.name} .player__hand-value`
    );
    sumContainer.innerHTML = "";
  };

  setValueOfSplitHands = () => {
    const sumContainerHand1 = this.controlsContainerEle.querySelector(
      `#${this.player.name} .card.active .player__hand-value`
    );
    sumContainerHand1.innerHTML = this.hand1Value;
    const sumContainerHand2 = this.controlsContainerEle
      .querySelector(`#${this.player.name} .card`)
      .lastElementChild.querySelector(".player__hand-value");
    sumContainerHand2.innerHTML = this.hand2Value;
  };

  doubleDownBet = async () => {
    const bettingCont = this.controlsContainerEle.querySelector(
      `#${this.player.name} .player__bet-value`
    );

    const [betValueStr] = bettingCont.textContent.split(" ").slice(1);
    const betValueNum = Number(betValueStr); //converting string to number
    const remainingAfterDoubling = this.player.pot - betValueNum;

    if (remainingAfterDoubling < 0) {
      this.playerCotrols.insertAdjacentHTML("beforeend", "not enough funds!!!");
      this.double.setAttribute("disabled", "true");
      await sleepNow(1000);
      this.playerCotrols.lastChild.remove();
      this.double.setAttribute("disabled", "true");
      return;
    }

    this.player.pot -= betValueNum;
    bettingCont.innerHTML = `Betting: ${betValueNum * 2}`; //doubling betValueNum;
    this.double.setAttribute("disabled", "true");

    this.hitCard(true);
    this.player.finishTurn();
  };

  removePlayerControls() {
    this.controlsContainerEle.querySelector(".player-controls")?.remove();
  }

  enableDoubleAndSplit = () => {
    this.double?.removeAttribute("disabled");
    this.split?.removeAttribute("disabled");
  };

  //  Most recent changes
  sumOfCards() {
    let hand;

    if (this.player.playerPlayedAllHands) {
      hand = this.secondHand;
    } else {
      hand = this.player.hand;
    }

    let sumOfHand = 0;

    const [arrOfCardsWithFixedValues, arrOfCardsWithAlternateValues] =
      hand.reduce(
        ([arrOfCardsWithFixedValues, arrOfCardsWithAlternateValues], card) => {
          if (card.alternateValue) {
            arrOfCardsWithAlternateValues.push(card);
          } else {
            arrOfCardsWithFixedValues.push(card);
          }
          return [arrOfCardsWithFixedValues, arrOfCardsWithAlternateValues];
        },
        [[], []]
      );

    let amountOfAces = arrOfCardsWithAlternateValues.length;

    for (let card of arrOfCardsWithFixedValues) {
      if (card.faceDirection === "down") break;
      sumOfHand += card.value;
    }

    if (amountOfAces !== 0) {
      for (let card of arrOfCardsWithAlternateValues) {
        if (card.faceDirection === "down") break;
        if (sumOfHand + card.value > 21) {
          sumOfHand = sumOfHand + card.alternateValue;
        } else {
          sumOfHand = sumOfHand + card.value;
        }
      }
    }

    if (this.player.playerPlayedAllHands) {
      this.hand2Value = sumOfHand;
    } else if (this.hasSplitCards) {
      this.hand1Value = sumOfHand;
    } else {
      this.player.handValue = sumOfHand;
    }

    return;
  }

  //render cards
  renderHandValue() {
    const sumContainer = this.controlsContainerEle.querySelector(
      `#${this.player.name} .player__hand-value`
    );
    sumContainer.innerHTML = this.player.handValue.toString();
  }

  renderHandValueWhenPlayerHasSplit() {
    const sumContainer = this.controlsContainerEle.querySelector(
      `#${this.player.name} .card.active .player__hand-value`
    );
    sumContainer.innerHTML = this.playerHandValueHtml();
  }

  playerHandValueHtml() {
    if (this.player.playerPlayedAllHands) {
      return this.hand2Value;
    } else if (this.hasSplitCards) {
      return this.hand1Value;
    } else {
      return this.player.handValue;
    }
  }

  renderCardWhenPlayerHasSplit() {
    let cardToRender;
    if (this.player.playerPlayedAllHands) {
      cardToRender = this.secondHand[this.nextCardToRenderHand2];
    } else {
      cardToRender = this.player.hand[this.nextCardToRenderHand1];
    }
    let htmlString = `<p>${cardToRender.number} of ${cardToRender.suit} <i class="${cardToRender.icon}  "></i></p>`;

    const cardContainerElem =
      this.controlsContainerEle.querySelector(".card.active");
    cardContainerElem.insertAdjacentHTML("afterbegin", htmlString);
    if (this.player.playerPlayedAllHands) {
      this.nextCardToRenderHand2++;
    } else {
      this.nextCardToRenderHand1++;
    }
  }

  renderNextCard() {
    if (this.player.nextCardToRender > this.player.hand.length - 1) return;
    let htmlString = "";
    const cardToRender = this.player.hand[this.player.nextCardToRender];
    if (cardToRender.faceDirection === "down") {
      htmlString = '<p id="hidden-card">Card down</p>';
    } else {
      htmlString += `<p>${cardToRender.number} of ${cardToRender.suit} <i class="${cardToRender.icon}  "></i></p>`;
    }
    const cardContainerElem = this.controlsContainerEle.querySelector(
      `#${this.player.name} .card`
    );
    cardContainerElem.insertAdjacentHTML("afterbegin", htmlString);
    this.player.nextCardToRender++;
  }
}
