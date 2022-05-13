"use strict";
//this class is going to create the players

export default class Player {
  domElement = null;

  constructor(name, pot = 200, playerType = "GuestPlayer") {
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

  sumOfCards() {
    let sumOfHand = 0;

    const [arrOfCardsWithFixedValues, arrOfCardsWithAlternateValues] =
      this.hand.reduce(
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
          sumOfHand += card.alternateValue;
        } else {
          sumOfHand += card.value;
        }
      }
    }

    this.handValue = sumOfHand;
    return;
  }

  renderHandValue() {
    const sumContainer = this.domElement.querySelector(".player__hand-value");
    sumContainer.innerHTML = this.handValue.toString();
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
      htmlString = '<p id="hidden-card">Card down</p>';
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
    this.domElement.querySelector("#hidden-card").remove();
    return secondCard;
  }

  addFocus() {
    this.domElement.querySelector(".card").classList.add("active");
  }

  removeFocus() {
    this.domElement.querySelector(".card").classList.remove("active");
  }

  removeFromPot(bet) {
    this.pot -= bet;
  }

  renderBetValue(bet) {
    this.domElement.insertAdjacentHTML("afterbegin", `Betting: ${bet}`);
  }
}
