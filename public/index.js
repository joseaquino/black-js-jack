"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
import { sleepNow } from "./Helpers.js";
import WelcomeScreen from "./WelcomeScreen.js";

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const playersForm = document.querySelector("#modal-form");

//creando instancia de Board
const game1 = new Board();
//Creando instancia de WelcomeScreen
const welcome = new WelcomeScreen();
//
welcome.enableWelcomeFunctionalities();

const start = function (e) {
  e.preventDefault();
  const playersNames = welcome.playersNames;

  // Creating players with proper name
  playersNames.forEach((name) => {
    game1.addPlayer(new Player(name));
  });

  //Rendering all players
  game1.players.forEach((player) => {
    player.renderPlayer();
  });

  //DEALER CANNOT BE MODIFIED  AND ALWAYS HAS TO BE CREATED AT THE END
  game1.dealerCreation();

  //Function to initiate cards distribution when pressing 'start'
  const startDistribution = async () => {
    //Hide player form and overlay to show game
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    await sleepNow(1500);

    game1.dealCards();
  };

  startDistribution();
};

playersForm.addEventListener("submit", start);
