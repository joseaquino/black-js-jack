"use strict";
export default class Card {
  faceDirection = "up";

  constructor(suit, number) {
    this.suit = suit;
    this.number = number;
    this.assignSuitIcon();
  }

  assignSuitIcon() {
    switch (this.suit) {
      case "clubs":
        this.icon = "fab fa-canadian-maple-leaf";
        break;
      case "diamonds":
        this.icon = "fas fa-gem";
        break;
      case "hearts":
        this.icon = "fas fa-heart";
        break;
      case "spades":
        this.icon = "fas fa-candy-cane";
        break;
    }
  }

  flipCard() {
    if (this.faceDirection === "up") {
      this.faceDirection = "down";
    } else {
      this.faceDirection = "up";
    }
  }
}
