"use strict";
export default class Card {
  faceDirection = "up";

  constructor(suit, number) {
    this.suit = suit;
    this.number = number;
    this.color = suit === "hearts" || suit === "spades" ? "red" : "black";
    this.assignSuitIcon();
    this.valueSelection();
  }

  valueSelection() {
    if (this.number >= 2 && this.number <= 10) this.value = this.number;
    if (this.number === "J" || this.number === "Q" || this.number === "K")
      this.value = 10;
    if (this.number === "As") {
      this.value = 11;
      this.alternateValue = 1;
    }
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
