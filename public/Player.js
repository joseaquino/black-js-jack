"use strict";
//this class is going to create the players

export default class Player {
  domElement = null;

  constructor(name, pot, playerType) {
    this.hand = [];
    this.name = name;
    this.pot = pot;
    this.playerType = playerType;
    this.nextCardToRender = 0;
  }

  renderPlayer() {
    this.renderPlayerHtml(".players");
  }

  renderPlayerHtml(containerElement) {
    if (this.domElement) return;

    const htmlPlayersContainer = document.querySelector(containerElement);
    const htmlPlayerString = `<div class="player" id="${this.name}">
      <h2 class="player-heading">${this.name}</h2>
      <div class="card"></div>
    </div>`;

    htmlPlayersContainer.insertAdjacentHTML("afterbegin", htmlPlayerString);
    this.domElement = htmlPlayersContainer.querySelector(`#${this.name}`);
  }

  receiveCard(card) {
    this.hand.push(card);
    this.renderNextCard();
  }

  renderNextCard() {
    if (this.nextCardToRender > this.hand.length - 1) return;

    let htmlString = "";

    const cardToRender = this.hand[this.nextCardToRender];

    if (cardToRender.faceDirection === "down") {
      htmlString = "Card down";
    } else {
      htmlString += `<p>${cardToRender.number} of ${cardToRender.suit} <i class="${cardToRender.icon}  "></i></p>`;
    }

    const cardContainerElem = this.domElement.querySelector(".card");

    cardContainerElem.insertAdjacentHTML("afterbegin", htmlString);

    this.nextCardToRender++;
  }
}
