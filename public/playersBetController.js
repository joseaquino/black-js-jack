"use strict";
export default class playersBetController {
  constructor(players) {
    this.currentPlayerTurn = 0;
    this.players = players;
    this.activePlayer = this.players[this.currentPlayerTurn];
    this.currentBet = 0;
    this.playersStillBetting = false;

    const controlsContainerEle = document.querySelector("#game");
    this.controlsContainerEle = controlsContainerEle;
  }

  //Cada jugador debe hacer su apuesta antes de la reparticion de cartas

  //Despues de repartir las cartas sila carta del dealer es As, los jugadores pueden hacer una apuesta de seguro, el maximo que se puee apostar es la miad de la apuesta inicial , se deja en la llinea de apuesta segura y se paga 2 a 1
  // si se hace apuesta de seguro luego el jugador inicia su mano con normalidad, es decir con las mismas opciones de siempre

  controlsHtml() {
    return `
    <div class='bet-controls'>
        <div class='bet-controls__pot'>Pot: ${this.activePlayer.pot}</div>
        <div class='bet-controls__bet'>Current bet: ${this.currentBet}</div>    
        <button type='button' class= 'bet-controls__btn btn--25'>
        25
        </button>
        <button type='button' class= 'bet-controls__btn btn--50'>
        50
        </button>
        <button type='button' class= 'bet-controls__btn btn--100'>
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

  rederBetControls() {
    this.controlsContainerEle.insertAdjacentHTML(
      "beforeend",
      this.controlsHtml()
    );
  }

  initPlayers() {
    this.amountOfPlayers = this.players.length;
    this.updateActivePlayer();
  }

  selectDomElements() {
    this.betControls = document.querySelector(".bet-controls");
    this.bet25 = this.controlsContainerEle.querySelector(".btn--25");
    this.bet50 = this.controlsContainerEle.querySelector(".btn--50");
    this.bet100 = this.controlsContainerEle.querySelector(".btn--100");
    this.clear = this.controlsContainerEle.querySelector(".btn--clear");
    this.currentPotCont =
      this.controlsContainerEle.querySelector(".bet-controls__pot");
    this.curretBetCont =
      this.controlsContainerEle.querySelector(".bet-controls__bet");
    this.confirm = this.controlsContainerEle.querySelector(".btn--bet");
  }

  addEventListeners() {
    this.bet25.addEventListener("click", this.betting.bind(this));
    this.bet50.addEventListener("click", this.betting.bind(this));
    this.bet100.addEventListener("click", this.betting.bind(this));
    this.clear.addEventListener("click", this.clearBet.bind(this));
    this.confirm.addEventListener("click", this.confirmBet.bind(this));
  }

  updateActivePlayer() {
    this.activePlayer = this.players[this.currentPlayerTurn];
    document
      .querySelector(`#${this.activePlayer.name} .card`)
      .classList.add("active");
  }

  nextPlayer() {
    document
      .querySelector(`#${this.activePlayer.name} .card`)
      .classList.remove("active");
    if (this.amountOfPlayers - 2 === this.currentPlayerTurn) {
      this.betControls.remove();
      this.playersStillBetting = true;
      return;
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
    this.activePlayer.pot -= betAddition;
    this.currentBet += 1 * betAddition;
    this.currentPotCont.innerHTML = `Pot: ${this.activePlayer.pot}`;
    this.curretBetCont.innerHTML = `Current bet: ${this.currentBet}`;
  }

  clearBet() {
    this.clear.disabled = true;
    this.confirm.disabled = true;
    this.activePlayer.pot += this.currentBet;
    this.currentBet = 0;
    this.currentPotCont.innerHTML = `Pot: ${this.activePlayer.pot}`;
    this.curretBetCont.innerHTML = `Current bet: ${this.currentBet}`;
  }

  confirmBet() {
    this.clear.disabled = true;
    this.confirm.disabled = true;
    let playerHtmlCont = document.querySelector(`#${this.activePlayer.name}`);
    playerHtmlCont.insertAdjacentHTML(
      "afterbegin",
      `Betting: ${this.currentBet}`
    );
    this.currentBet = 0;
    this.nextPlayer();
  }

  async allowInitialBet(fn) {
    if (!this.playersStillBetting) {
      // await sleepNow(1500);
      this.loopInit(() => this.allowInitialBet(fn));
    } else {
      fn();
      return;
    }
  }

  loopInit(fn) {
    console.log("inLoopInit");
    window.requestAnimationFrame(fn.bind(this));
  }
}
