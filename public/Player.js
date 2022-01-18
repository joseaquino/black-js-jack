"use strict";
//this class is going to create the players

export default class Player {
  domElement = null;

  constructor(name, pot, playerType) {
    this.hand = [];
    this.name = name;
    this.pot = pot;
    this.playerType = playerType;
  }

  renderPlayerHtml(name) {
    const htmlPlayersContainer = document.querySelector(".players");
    const htmlPlayerString = `<div class="player">
      <h2 class="player-heading">${name}</h2>
      <div class="card" id="${name}"></div>
    </div>`;

    htmlPlayersContainer.insertAdjacentHTML("afterbegin", htmlPlayerString);
  }

  setDomElement(name) {
    this.domElement = document.querySelector(`#${name}`);
  }

  receiveCard(card) {
    this.hand.push(card);
  }

  totalCardsInHand() {
    return this.hand.length;
  }

  renderCards(arr) {
    let htmlString = "";

    arr.forEach((card) => {
      if (card.faceDirection === "down") {
        htmlString = "Card down";
      } else {
        htmlString += `<p>${card.number} of ${card.suit} <i class="${card.icon}  "></i></p>`;
      }
    });
    this.domElement.insertAdjacentHTML("afterbegin", htmlString);
  }

  render() {
    if (!this.domElement) {
      throw new Error(
        `Cannot render player ${this.name} because it is missing a DOM element where to place it`
      );
    }
  }
}
