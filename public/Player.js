"use strict";
//this class is going to create the players

export default class Player {
  domElement = null;

  constructor(name, pot = 5000, playerType = "GuestPlayer") {
    this.hand = [];
    this.name = name;
    this.pot = pot;
    this.playerType = playerType;
    this.nextCardToRender = 0;
    this.bet = 0;
  }

  renderPlayer() {
    this.renderPlayerHtml(".players");
  }

  playerHtml() {
    return `
    <div class="player" id="${this.name}">
      <h2 class="player-heading">${this.name}</h2>
      <div class="card"></div>
      <div class='player__hand-value'></div>
      <div class='player__bet-value'></div>
    </div>
    
    `;
  }

  renderPlayerHtml(containerElement) {
    if (this.domElement) return;
    const htmlPlayersContainer = document.querySelector(containerElement);
    htmlPlayersContainer.insertAdjacentHTML("afterbegin", this.playerHtml());
    this.domElement = htmlPlayersContainer.querySelector(`#${this.name}`);
  }

  initialBet() {}

  playerBetValurHtml() {
    return `
    Apuesta:${this.betValue}
    `;
  }

  renderBetValue() {}

  sumOfCards() {
    let sumOfHand = 0;

    const arrOfCardsWithFixedValues = this.hand.filter(
      (card) => !card.alternateValue
    );

    const arrOfCardsWithAlternateValues = this.hand.filter(
      (card) => card.alternateValue
    );

    let amountOfAces = arrOfCardsWithAlternateValues.length;
    let alternateValuesUsed = 0;
    const amountReducedIfAceChangesTo1 = 10;

    for (let card of arrOfCardsWithFixedValues) {
      if (card.faceDirection === "down") break;
      sumOfHand += card.value;
    }

    if (amountOfAces === 0) {
      this.handValue = sumOfHand;
      return;
    }

    for (let card of arrOfCardsWithAlternateValues) {
      if (card.faceDirection === "down") break;
      if (sumOfHand + card.value > 21) {
        sumOfHand = sumOfHand + card.alternateValue;
        alternateValuesUsed++;
      } else {
        sumOfHand = sumOfHand + card.value;
      }

      if (sumOfHand > 21 && alternateValuesUsed < amountOfAces) {
        sumOfHand -= amountReducedIfAceChangesTo1;
        alternateValuesUsed++;
      }
    }
    this.handValue = sumOfHand;

    return;
  }

  playerHandValueHtml() {
    return `    
    ${this.handValue}    
    `;
  }

  renderHandValue() {
    const sumContainer = document
      .querySelector(`#${this.name}`)
      .querySelector(".player__hand-value");
    sumContainer.innerHTML = this.playerHandValueHtml();
  }

  receiveCard(card) {
    this.hand.push(card);
    this.renderNextCard();
    this.sumOfCards();
    this.renderHandValue();
  }

  renderNextCard() {
    if (this.nextCardToRender > this.hand.length - 1) return;
    let htmlString = "";
    const cardToRender = this.hand[this.nextCardToRender];
    if (cardToRender.faceDirection === "down") {
      htmlString = '<p id="hidden">Card down</p>';
    } else {
      htmlString += `<p>${cardToRender.number} of ${cardToRender.suit} <i class="${cardToRender.icon}  "></i></p>`;
    }
    const cardContainerElem = this.domElement.querySelector(".card");
    cardContainerElem.insertAdjacentHTML("afterbegin", htmlString);
    this.nextCardToRender++;
  }

  secondDealerCard() {
    const secondCard = this.hand.pop();
    secondCard.flipCard();
    document.querySelector("#hidden").remove();
    return secondCard;
  }
}
