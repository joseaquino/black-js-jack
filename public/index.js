"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
import WelcomeScreen from "./WelcomeScreen.js";
import { sleepNow } from "./Helpers.js";
import WelcomeScreen from "./WelcomeScreen.js";

const start = () => {
  const container = document.querySelector("#game");

  if (!container) {
    throw new Error(
      "Container with ID game is missing in the document, make sure to include this in your index.html"
    );
  }

  const restartBtn = document.createElement("button");
  restartBtn.innerHTML = "Choose new players";

  const welcomeScreen = new WelcomeScreen( async (players) => {
    const game = new Board();
    container.prepend(restartBtn);
    players.forEach((player) => game.addPlayer(new Player(player.name)));

    game.players.forEach((player) => {
      player.renderPlayer();
    });
    game.createDealer();

    // We will wait some time before dealing the cards to smooth out the transition between the welcome screen and the board
    await sleepNow(1500);
    await game.dealCards();

    restartBtn.addEventListener("click", () => {
      game.clearBoard();
      welcomeScreen.render();
      restartBtn.remove();
    });
  });

  welcomeScreen.render();
};

start();
