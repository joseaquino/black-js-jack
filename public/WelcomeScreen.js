"use strict";
export default class WelcomeScreen {
  constructor() {
    this.playersNames = [];
    this.amountOfPlayers = 0;
    this.maxPlayersAllowed = 4;
  }

  playersForm = document.querySelector("#modal-form");
  modalPlayerCont = document.querySelector("#modal-playerCont");
  btnAdd = document.querySelector("#add");
  btnRemove = document.querySelector("#remove");
  btnStart = document.querySelector("#start");

  //-----------------------------------------------------------START---------------------------------//

  setPlayersNames(e) {
    e.preventDefault();
    this.btnStart.setAttribute("disabled", "true");
  }

  //------------------------------------ ADD PLAYER LOGIC----------------------------------------------//

  addPlayerField = function () {
    const minCharactersAllowed = 4;
    const maxCharactersAllowed = 12;
    const playerIdPrefix = "P";

    this.amountOfPlayers++;

    this.amountOfPlayers > 0 ? this.btnRemove.removeAttribute("disabled") : "";

    this.amountOfPlayers === this.maxPlayersAllowed
      ? this.btnAdd.setAttribute("disabled", "true")
      : "";

    //Creating string for element
    const playerFieldHtmlString = `  <div class="modal-player" id="${playerIdPrefix}${this.amountOfPlayers}">
  <label>Payer${this.amountOfPlayers}</label>
  <input
    type="text"
    minlength="4"
    maxlength="12"
    placeholder="NoobMaster${this.amountOfPlayers}"
    required
  />
</div>`;

    //selecting parent where we should insert html
    this.modalPlayerCont.insertAdjacentHTML("beforeend", playerFieldHtmlString);
    //selecting input element from player field
    const inputEl = document.querySelector(
      `.modal-player:nth-of-type(${this.amountOfPlayers}) input`
    );

    //adding event listener to capture player name

    inputEl.addEventListener("change", (e) => {
      //Each placeholder has the player position at the end
      let playersNamesPosition = e.target.placeholder.slice(-1);

      if (
        e.target.value.length >= minCharactersAllowed &&
        e.target.value.length <= maxCharactersAllowed
      ) {
        this.playersNames[playersNamesPosition - 1] = e.target.value;
      }
    });

    //allowing start if there is a player
    if (this.amountOfPlayers === 1) {
      this.btnStart.removeAttribute("disabled");
    }
  };

  //----------------------------REMOVE PLAYER LOGIC---------------------------------------//

  removePlayerField = function () {
    const lastPlayerField = this.modalPlayerCont.lastElementChild;

    this.amountOfPlayers--;
    if (this.amountOfPlayers === 0) {
      this.btnRemove.setAttribute("disabled", "true");
      this.btnStart.setAttribute("disabled", "true");
    }
    this.amountOfPlayers < this.maxPlayersAllowed
      ? this.btnAdd.removeAttribute("disabled")
      : "";
    lastPlayerField.remove();
    //removing last players name when element is deleted
    this.playersNames.splice(this.amountOfPlayers);

    //disabling start because there are no players added
    if (this.amountOfPlayers === 0) {
      this.playersForm.setAttribute("disabled", "true");
    }
  };

  //--------------------------LISTENER TO ADD, REMOVE PLAYERS AND SUBMIT PLAYERS------------------------------//

  enableWelcomeFunctionalities() {
    this.btnAdd.addEventListener("click", this.addPlayerField.bind(this));
    this.btnRemove.addEventListener("click", this.removePlayerField.bind(this));
    this.playersForm.addEventListener(
      "submit",
      this.setPlayersNames.bind(this)
    );
  }
}
