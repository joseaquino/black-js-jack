"use strict";

export default class playerDecisionController {
  constructor(board) {
    if (!Array.isArray(board.players)) {
      throw new Error(
        `You must provider an array with the players to the playerDecisionController constructor`
      );
    }
    this.board = board;
    this.players = this.board.players;
    this.amountOfPlayers = this.players.length;

    this.controlsContainerEle = this.board.boardContainerElem;
    this.controlsContainerEle.insertAdjacentHTML(
      "beforeend",
      this.controlsHtml()
    );

    this.hit = this.controlsContainerEle.querySelector(".btn--hitting");
    this.stand = this.controlsContainerEle.querySelector(".btn--standing");
    this.split = this.controlsContainerEle.querySelector(".btn--splitting");
    this.double = this.controlsContainerEle.querySelector(".btn--doubling");

    this.hit.addEventListener("click", this.hitting.bind(this));
    this.stand.addEventListener("click", this.standing.bind(this));

    this.definePlayerTurn();
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
    <button type='button' class='player-controls__btn btn--splitting'> 
    Split
    </button>  
    <button type='button' class='player-controls__btn btn--doubling'> 
    Double down
    </button>      
  </div>`;
  }

  definePlayerTurn() {
    this.currentPlayerTurn = 0;
    for (let player of this.players) {
      if (player.handValue === 21) this.currentPlayerTurn++;
      else {
        document
          .querySelector(`#${this.players[this.currentPlayerTurn].name} .card`)
          .classList.add("active");
        if (this.isDealerTurn()) {
          this.dealerPlay();
        }
        return;
      }
    }
  }

  hasPlayer21() {
    return this.players[this.currentPlayerTurn].handValue === 21;
  }

  hasPlayer21OrMore() {
    return this.players[this.currentPlayerTurn].handValue >= 21;
  }

  isDealerTurn() {
    return this.currentPlayerTurn === this.amountOfPlayers - 1;
  }

  dealerPlay() {
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
    document
      .querySelector(`#${this.players[this.currentPlayerTurn].name}`)
      .querySelector(".card")
      .classList.remove("active");

    this.currentPlayerTurn++;
    if (this.hasPlayer21OrMore() && !this.isDealerTurn())
      this.currentPlayerTurn++;
    document
      .querySelector(`#${this.players[this.currentPlayerTurn].name}`)
      .querySelector(".card")
      .classList.add("active");

    if (this.isDealerTurn()) {
      this.dealerPlay();
      return;
    }

    return;
  }

  hitting() {
    const card = this.board.dealCard();
    this.players[this.currentPlayerTurn].receiveCard(card);
    if (this.hasPlayer21OrMore() && !this.isDealerTurn()) this.nextPlayer();
    return;
  }

  standing() {
    this.nextPlayer();
  }
}
