"use strict";
export default class PlayersBetController {
  constructor(board) {
    this.currentPlayerTurn = 0;
    this.board = board;
    this.currentBet = 0;

    this.controlsContainerEle = this.board.boardContainerElem;
  }

  //Each player must place their bet before the cards are dealt

  //After dealing the cards if the dealer's card is Ace, the players can make an insurance bet, the maximum that can be bet is half the initial bet, it is left on the insurance bet line and it pays 2 to one
  // if an insurance bet is made, then the player starts his hand normally, that is, with the same options as always

  controlsHtml() {
    return `
    <div class='bet-controls'>
        <div class='bet-controls__pot'>Pot: ${this.activePlayer.pot}</div>
        <div class='bet-controls__bet'>Current bet: ${this.currentBet}</div>    
        <button data-amount="25" type='button' class= 'bet-controls__btn btn--25'>
        25
        </button>
        <button data-amount="50" type='button' class= 'bet-controls__btn btn--50'>
        50
        </button>
        <button data-amount="100" type='button' class= 'bet-controls__btn btn--100'>
        100
        </button>    
        <button type='button' disabled class= 'bet-controls__btn btn--clear'>
        Clear
        </button>
        <button type='button' disabled class= 'bet-controls__btn btn--bet'>
        Confirm bet
        </button>
    </div>    
      `;
  }

  renderBetControls() {
    this.controlsContainerEle.insertAdjacentHTML(
      "beforeend",
      this.controlsHtml()
    );
  }

  initBetController() {
    this.initPlayers();
    this.renderBetControls();
    this.selectDomElements();
    this.addEventListeners();
  }

  initPlayers() {
    this.players = this.board.players;
    this.updateActivePlayer();
  }

  selectDomElements() {
    this.betControls = document.querySelector(".bet-controls");
    this.betButtons = this.betControls.querySelectorAll("[data-amount]");
    this.clear = this.controlsContainerEle.querySelector(".btn--clear");
    this.currentPotCont =
      this.controlsContainerEle.querySelector(".bet-controls__pot");
    this.curretBetCont =
      this.controlsContainerEle.querySelector(".bet-controls__bet");
    this.confirm = this.controlsContainerEle.querySelector(".btn--bet");
  }

  addEventListeners() {
    this.addingEventListenerToBetButtons();
    this.clear.addEventListener("click", this.clearBet.bind(this));
    this.confirm.addEventListener("click", this.confirmBet.bind(this));
  }

  updateActivePlayer() {
    this.activePlayer = this.players[this.currentPlayerTurn];
    this.activePlayer.addFocus();
  }

  isLastPlayerTurn() {
    const lastPlayerPosition = this.players.length - 2;
    return lastPlayerPosition === this.currentPlayerTurn;
  }

  isLastPlayerTurn() {
    const lastPlayerPosition = this.players.length - 2;
    return lastPlayerPosition === this.currentPlayerTurn;
  }

  nextPlayer() {
    this.activePlayer.removeFocus();
    if (this.isLastPlayerTurn()) {
      this.betControls.remove();
      this.board.startWithGameDealing();
    } else {
      this.currentPlayerTurn++;
      this.updateActivePlayer();
      this.currentPotCont.innerHTML = `Pot: ${this.activePlayer.pot}`;
      this.curretBetCont.innerHTML = `Current bet: ${this.currentBet}`;
    }
  }

  betting(e) {
    this.clear.disabled = false;
    this.confirm.disabled = false;
    const betAddition = e.target.innerText;

    if (this.activePlayer.pot - betAddition < 0) {
      return;
    }

    this.activePlayer.removeFromPot(betAddition);
    this.currentBet += Number(betAddition);
    this.currentPotCont.innerHTML = `Pot: ${this.activePlayer.pot}`;
    this.curretBetCont.innerHTML = `Current bet: ${this.currentBet}`;

    this.disablingBetButtons();
  }

  clearBet() {
    //is there a better way to do this ?
    this.enableBettingButtons();

    this.clear.disabled = true;
    this.confirm.disabled = true;
    this.activePlayer.pot += this.currentBet;
    this.currentBet = 0;
    this.currentPotCont.innerHTML = `Pot: ${this.activePlayer.pot}`;
    this.curretBetCont.innerHTML = `Current bet: ${this.currentBet}`;
  }

  confirmBet() {
    this.enableBettingButtons();
    this.clear.disabled = true;
    this.confirm.disabled = true;
    this.activePlayer.renderBetValue(this.currentBet);
    this.currentBet = 0;
    this.nextPlayer();
  }

  addingEventListenerToBetButtons() {
    this.betButtons.forEach((button) =>
      button.addEventListener("click", this.betting.bind(this))
    );
  }

  enableBettingButtons() {
    this.betButtons.forEach((button) => button.removeAttribute("disabled"));
  }

  disablingBetButtons() {
    this.betButtons.forEach((button) => {
      if (this.activePlayer.pot < Number(button.getAttribute("data-amount"))) {
        button.setAttribute("disabled", "true");
      }
    });
  }
}
