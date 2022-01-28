"use strict";
const MAX_AMOUNT_OF_PLAYERS = 4;

export default class WelcomeScreen {
  playersDefinition = [];
  hasBeenRendered = false;

  constructor(onStart) {
    if (typeof onStart !== 'function') {
      throw new Error(`You must provider a function callback to the WelcomeScreen constructor, provided type ${typeof onStart}`)
    }
    this.onStart = onStart;
    const modalContainerElem = document.createElement('div')
    modalContainerElem.classList.add('modal')
    this.modalContainerElem = modalContainerElem;

    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal__overlay')
    this.modalOverlayElem = modalOverlay;

    this.modalContainerElem.innerHTML = this.modalHtml();

    this.removePlayerBtnElem = this.modalContainerElem.querySelector('.btn-remove')
    this.addPlayerBtnElem = this.modalContainerElem.querySelector('.btn-add')
    this.playerListElem = this.modalContainerElem.querySelector('.modal-player-container')
    this.playerFormElem = this.modalContainerElem.querySelector('.modal__form')
    this.errorMessageElem = this.modalContainerElem.querySelector('.error-message')

    this.removePlayerBtnElem.addEventListener('click', this.removePlayerField.bind(this))
    this.addPlayerBtnElem.addEventListener('click', () => {
      this.addPlayerField({ name: "" })
    })
    this.playerFormElem.addEventListener('submit', this.startGame.bind(this))
    this.gameStartControlElem  = this.playerFormElem.querySelector('button[type="submit"]')
  }

  startGame() {
    this.onStart(this.playersDefinition)
    this.removeModalFromDocument()
  }

  removeModalFromDocument() {
    this.modalContainerElem.remove()
    this.modalOverlayElem.remove()
    this.hasBeenRendered = false
    this.playersDefinition = [];
    const playerInputs = this.playerListElem.querySelector('ul')
    playerInputs.innerHTML = ''
  }

  modalHtml() {
    return `
      <h2 class="modal__header">
        Add at least one player to start a new game!
      </h2>
      <form class="modal__form">
        <div class="btn-container">
          <button type="button" disabled class="btn btn-remove">
            <i class="fas fa-minus"></i>
          </button>
          <button type="button" class="btn btn-add">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="modal-player-container">
            <p class="error-message"></p>
            <ul></ul>
        </div>

        <button type="submit" class="btn" disabled>Start</button>
      </form>
    `
  }

  playerFieldHtml(playerIndex, initialValue) {
    return `
      <li id="player-${playerIndex}">
        <label>Player ${playerIndex + 1}</label>
        <input
          type="text"
          minlength="1"
          placeholder="Enter player name like NoobMaster69"
          ${initialValue ? `value="${initialValue}"` : ''}
          required
        />
      </li>
    `
  }

  togglePlayerControl(controlType, shouldDisable) {
    let playerControl;

    switch (controlType) {
      case "ADD":
        playerControl = this.addPlayerBtnElem;
        break;
      case "REMOVE":
        playerControl = this.removePlayerBtnElem;
        break;
      case "SUBMIT":
        playerControl = this.gameStartControlElem;
        break;
    }

    if (!playerControl) {
      throw new Error(`You must provide a valid control type of REMOVE, ADD or SUBMIT, provided ${controlType}`)
    }

    const isCurrentlyDisabled = playerControl.getAttribute('disabled');

    if (isCurrentlyDisabled === null && shouldDisable) {
      playerControl.setAttribute('disabled', 'true')
    } else {
      playerControl.removeAttribute('disabled')
    }
  }

  getLastPlayer() {
    return this.playersDefinition[this.playersDefinition.length - 1]
  }

  isPlayerValid(player) {
    return player.name.trim() !== '';
  }

  hasMaxPlayersReached() {
    return this.playersDefinition.length >= MAX_AMOUNT_OF_PLAYERS
  }

  areAllPlayersValid() {
    if (this.playersDefinition.length === 0) return false;

    const validPlayers = this.playersDefinition.filter(this.isPlayerValid)

    return validPlayers.length === this.playersDefinition.length;
  }

  showErrorMessage(error) {
    this.errorMessageElem.innerHTML = error
  }

  clearErrorMessage() {
    this.errorMessageElem.innerHTML = ''
  }

  addPlayerField(newPlayer) {
    const lastAddedPlayer = this.getLastPlayer()

    if (this.hasBeenRendered && !this.isPlayerValid(lastAddedPlayer)) {
      this.showErrorMessage('You must first add a name to the last created player')
      return;
    } else {
      this.clearErrorMessage()
    }

    this.playersDefinition.push(newPlayer)
    this.togglePlayerControl('ADD', this.hasMaxPlayersReached())
    this.togglePlayerControl('REMOVE', this.playersDefinition.length === 0)
    const newPlayerIndex = this.playersDefinition.length - 1;
    const playerList = this.playerListElem.querySelector('ul')
    playerList.insertAdjacentHTML('beforeend', this.playerFieldHtml(newPlayerIndex, newPlayer.name))
    const playerInput = playerList.querySelector(`#player-${newPlayerIndex} input`)
    playerInput.addEventListener('input', (event) => {
      this.updatePlayer(newPlayerIndex, event.target.value)
    })
  };

  updatePlayer(playerIndex, playerName) {
    const playerToEdit = this.playersDefinition[playerIndex]

    if (!playerToEdit) {
      throw new Error('You are trying to edit a player that doesn\'t exist in the player definition array')
    }

    this.playersDefinition[playerIndex] = {...playerToEdit, name: playerName};
    this.togglePlayerControl('SUBMIT', !this.areAllPlayersValid())
  }

  removePlayerField() {
    if (this.playersDefinition.length === 0) return;

    const lastPlayerIndex = this.playersDefinition.length - 1
    this.playersDefinition = this.playersDefinition.slice(0, lastPlayerIndex);

    const lastPlayerElem = this.playerListElem.querySelector(`#player-${lastPlayerIndex}`)

    if (lastPlayerElem) lastPlayerElem.remove()
    this.clearErrorMessage()
    this.togglePlayerControl('ADD', this.hasMaxPlayersReached())
    this.togglePlayerControl('REMOVE', this.playersDefinition.length === 0)
    this.togglePlayerControl('SUBMIT', !this.areAllPlayersValid())
  };

  render() {
    if (this.hasBeenRendered) return;


    this.addPlayerField({ name: "" })
    const bodyElem = document.querySelector('body')
    bodyElem.append(this.modalContainerElem)
    bodyElem.append(this.modalOverlayElem)
    this.hasBeenRendered = true;
  }
}
