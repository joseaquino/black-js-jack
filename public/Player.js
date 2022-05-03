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
    this.splitedCards = false;
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

  initialBet() {}

  playerBetValurHtml() {
    return `
    Apuesta:${this.betValue}
    `;
  }

  renderBetValue() {}

  sumOfCards() {
    let hand;

    switch (true) {
      case this.playerPlayedBothHands:
        hand = this.secondHand;
        break;
      default:
        hand = this.hand;
    }

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

    if (amountOfAces === 0) {
      switch (true) {
        case this.playerPlayedBothHands:
          this.hand2Value = sumOfHand;
          break;
        case this.splitedCards:
          this.hand1Value = sumOfHand;
          break;
        default:
          this.handValue = sumOfHand;
      }

      return;
    }
    // debugger;
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

    switch (true) {
      case this.playerPlayedBothHands:
        this.hand2Value = sumOfHand;
        break;
      case this.splitedCards:
        this.hand1Value = sumOfHand;
        break;
      default:
        this.handValue = sumOfHand;
    }
    //Anterior 
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

  playerHandValueHtml() {
    switch (true) {
      case this.playerPlayedBothHands:
        return `${this.hand2Value}`;

      case this.splitedCards:
        return `${this.hand1Value}`;
      default:
        return `${this.handValue}`;
    }
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

  receiveCardforSplittedHand(card) {
    if (this.playerPlayedBothHands) {
      this.secondHand.push(card);
    } else {
      this.hand.push(card);
    }
    this.renderCardWhenPlayerHasSplitted();
    this.sumOfCards();
    this.renderHandValueWhenPlayerHasSplitted();
  }

  // receiveCardforHand2(card) {
  //   this.secondHand.push(card);
  // }

  renderHandValueWhenPlayerHasSplitted() {
    const sumContainer = document.querySelector(
      `#${this.name} .card.active .player__hand-value`
    );
    sumContainer.innerHTML = this.playerHandValueHtml();
  }

  renderCardWhenPlayerHasSplitted() {
    let cardToRender;
    if (this.playerPlayedBothHands) {
      cardToRender = this.secondHand[this.nextCardToRenderHand2];
    } else {
      cardToRender = this.hand[this.nextCardToRenderHand1];
    }
    let htmlString = `<p>${cardToRender.number} of ${cardToRender.suit} <i class="${cardToRender.icon}  "></i></p>`;

    const cardContainerElem = document.querySelector(".card.active");
    cardContainerElem.insertAdjacentHTML("afterbegin", htmlString);
    if (this.playerPlayedBothHands) {
      this.nextCardToRenderHand2++;
    } else {
      this.nextCardToRenderHand1++;
    }
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
