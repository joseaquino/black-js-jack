"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
import { sleepNow } from "./Helpers.js";

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const playersForm = document.querySelector("#modal__form");
const modalPlayerCont = document.querySelector("#modal__playerCont");
const btnStart = document.querySelector("#start");

const btnAdd = document.querySelector("#add");
const btnRemove = document.querySelector("#remove");

//------------------------------------------------------------------------

//------------------------FUNCTION WHERE THERE ARE NOT PLAYER TO AVOID STARTING THE GAME -------//

//--------------------------- GLOBAL VARIABLES -- SHOULD I WRAP THEM INTO A FUNCITON?????--------------------//

let amountOfPlayers = 0;
const playersNames = [];

//--------------------------FUNCTION TO START THE GAME---------------------//

const start = function (e) {
  e.preventDefault();
  //disbling possibilite of clicking more than once
  btnStart.setAttribute("disabled", "true");

  const game1 = new Board();

  //Creating players with proper name
  playersNames.forEach((name) => {
    game1.addPlayer(new Player(name));
  });

  InitiateGame();

  function InitiateGame() {
    //Rendering all players
    game1.players.forEach((player) => {
      player.renderPlayer();
    });
    console.log(game1.players);
    //DEALER CANNOT BE MODIFIED  AND ALWAYS HAS TO BE CREATED AT THE END
    game1.dealerCreation();

    //Function to initiate cards distribution when pressing 'start'
    const startDistribution = async (e) => {
      //Hide player form and overlay to show game
      modal.classList.add("hidden");
      overlay.classList.add("hidden");

      await sleepNow(1500);

      game1.dealCards();
    };

    startDistribution();
  }
};

//------------------------------------ ADD PLAYER LOGIC----------------------------------------------//
const maxPlayersAllowed = 4;
const addPlayerField = function () {
  const minCharactersAllowed = 4;
  const maxCharactersAllowed = 12;
  const playerIdPrefix = "P";

  amountOfPlayers++;

  amountOfPlayers > 0 ? btnRemove.removeAttribute("disabled", "false") : "";

  amountOfPlayers === maxPlayersAllowed
    ? btnAdd.setAttribute("disabled", "true")
    : "";

  //Creating string for element
  const playerFieldHtmlString = `  <div class="modal-player" id="${playerIdPrefix}${amountOfPlayers}">
  <label>Payer${amountOfPlayers}</label>
  <input
    type="text"
    minlength="4"
    maxlength="12"
    placeholder="NoobMaster${amountOfPlayers}"
    required
  />
</div>`;

  //selecting parent where we should insert html
  modalPlayerCont.insertAdjacentHTML("beforeend", playerFieldHtmlString);
  //selecting input element from player field
  const inputEl = document.querySelector(
    `.modal-player:nth-of-type(${amountOfPlayers}) input`
  );

  //adding event listener to capture player name
  console.log(amountOfPlayers);
  inputEl.addEventListener("change", (e) => {
    let playersNamesPosition = e.target.placeholder.slice(-1);
    console.log("changeee");
    if (
      e.target.value.length >= minCharactersAllowed &&
      e.target.value.length <= maxCharactersAllowed
    ) {
      playersNames[playersNamesPosition - 1] = e.target.value;
    }
  });

  //allowing start if there is a player
  if (amountOfPlayers === 1) {
    btnStart.removeAttribute("disabled");
  }
};

//----------------------------REMOVE PLAYER LOGIC---------------------------------------//

const removePlayerField = function () {
  const lastPlayerField = modalPlayerCont.lastElementChild;

  amountOfPlayers--;
  if (amountOfPlayers === 0) {
    btnRemove.setAttribute("disabled", "true");
    btnStart.setAttribute("disabled", "true");
  }
  amountOfPlayers < maxPlayersAllowed
    ? btnAdd.removeAttribute("disabled", "false")
    : "";
  lastPlayerField.remove();
  //removing last players name when element is deleted
  playersNames.splice(amountOfPlayers);

  //disabling start because there are no players added
  if (amountOfPlayers === 0) {
    playersForm.setAttribute("disabled", "true");
  }
};

//--------------------------LISTENER TO ADD AND REMOVE PLAYERS------------------------------//

btnAdd.addEventListener("click", addPlayerField);
btnRemove.addEventListener("click", removePlayerField);
playersForm.addEventListener("submit", start);

/*
"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
import { sleepNow } from "./Helpers.js";

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const playersForm = document.querySelector("#modal__form");
const modalPlayerCont = document.querySelector("#modal__playerCont");

const btnAdd = document.querySelector("#add");
const btnRemove = document.querySelector("#remove");

//------------------------------------------------------------------------

//--------------------------- GLOBAL VARIABLES -- SHOULD I WRAP THEM INTO A FUNCITON?????--------------------//

let amountOfPlayers = 0;
const playersNames = [];
const maxPlayersAllowed = 4;
playersForm.addEventListener("submit", (e) => e.preventDefault());

//--------------------------FUNCTION TO START THE GAME---------------------//

const start = function (e) {
  e.preventDefault();
  //disbling possibilite of clicking more than once
  playersForm.removeEventListener("submit", start);

  console.log(playersNames);

  const game1 = new Board();

  if (amountOfPlayers > 0) {
    const player1 = new Player(playersNames[0]);
    player1.renderPlayer();
    game1.addPlayer(player1);
  }

  if (amountOfPlayers > 1) {
    const player2 = new Player(playersNames[1]);
    player2.renderPlayer();
    game1.addPlayer(player2);
  }

  if (amountOfPlayers > 2) {
    const player3 = new Player(playersNames[2]);
    player3.renderPlayer();
    game1.addPlayer(player3);
  }

  if (amountOfPlayers > 3) {
    const player4 = new Player(playersNames[3]);
    player4.renderPlayer();
    game1.addPlayer(player4);
  }

  InitiateGame();

  function InitiateGame() {
    //Rendering all players
    game1.players.forEach((player) => {
      player.renderPlayer();
    });

    //DEALER CANNOT BE MODIFIED  AND ALWAYS HAS TO BE CREATED AT THE END
    game1.dealerCreation();

    //Function to initiate cards distribution when pressing 'start'
    const startDistribution = async (e) => {
      //Hide player form and overlay to show game
      modal.classList.add("hidden");
      overlay.classList.add("hidden");

      await sleepNow(1500);

      game1.dealCards();
    };

    startDistribution();
  }
};

//------------------------FUNCTION WHERE THERE ARE NOT PLAYER TO AVOID STARTING THE GAME -------//

const notReadyToStart = function (e) {
  e.preventDefault();
};

//------------------------------------ ADD PLAYER LOGIC----------------------------------------------//

const addPlayer = function () {
  if (amountOfPlayers === maxPlayersAllowed) return;
  amountOfPlayers++;

  //Creating string for element
  const playerFieldHtmlString = `  <div class="modal-player" id="P${amountOfPlayers}">
  <label>Payer${amountOfPlayers}</label>
  <input
    type="text"
    minlength="4"
    maxlength="12"
    placeholder="NoobMaster${amountOfPlayers}"
    required

    ;
  />
</div>`;

  //selecting parent where we should insert html
  modalPlayerCont.insertAdjacentHTML("beforeend", playerFieldHtmlString);
  //selecting input element from player field
  const inputEl = document
    .querySelector(`.modal-player:nth-of-type(${amountOfPlayers})`)
    .querySelector(`input`);
  //adding event listener to capture player name
  inputEl.addEventListener("change", (e) => {
    console.log("changeeee");
    playersNames.push(e.target.value);
  });

  //allowing start if there is a player
  if (amountOfPlayers === 1) {
    playersForm.removeEventListener("submit", notReadyToStart);

    playersForm.addEventListener("submit", start);
  }
};

//----------------------------REMOVE PLAYER LOGIC---------------------------------------//

const removePlayer = function () {
  const lastPlayerField = modalPlayerCont.lastElementChild;

  if (lastPlayerField === null) return;
  amountOfPlayers--;
  lastPlayerField.remove();
  //removing last players name when element is deleted
  playersNames.splice(amountOfPlayers);

  //disabling start because there are no players added
  if (amountOfPlayers === 0) {
    playersForm.removeEventListener("submit", start);

    playersForm.addEventListener("submit", notReadyToStart);
  }
};

//--------------------------LISTENER TO ADD AND REMOVE PLAYERS------------------------------//

btnAdd.addEventListener("click", addPlayer);
btnRemove.addEventListener("click", removePlayer);
*/
