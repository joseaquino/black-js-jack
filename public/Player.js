//this class is going to create the players

export default class Player {
  domElement = null;

  constructor(name, pot, playerType) {
    this.hand = [];
    this.name = name;
    this.pot = pot;
    this.playerType = playerType
  }

  setDomElement(element) {
    this.domElement = element;
  }

  receiveCard(card) {
    this.hand.push(card)
  }

  totalCardsInHand() {
    return this.hand.length;
  }

  render() {
    if (!this.domElement) {
      throw new Error(`Cannot render player ${this.name} because it is missing a DOM element where to place it`);
    }
    // TODO: Render player cards
  }
}
