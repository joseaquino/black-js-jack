"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
import WelcomeScreen from "./WelcomeScreen.js";
import { sleepNow } from "./Helpers.js";

const start = () => {
  const container = document.querySelector("#game");

  if (!container) {
    throw new Error(
      "Container with ID game is missing in the document, make sure to include this in your index.html"
    );
  }

  const restartBtn = document.createElement("button");
  restartBtn.innerHTML = "Choose new players";

  const welcomeScreen = new WelcomeScreen((players) => {
    container.prepend(restartBtn);
    const game = new Board();
    players.forEach((player) => game.addPlayer(new Player(player.name)));

    game.players.forEach((player) => {
      player.renderPlayer();
    });
    game.dealerCreation();

    const startDistribution = async () => {
      await sleepNow(1500);
      game.dealCards();
    };

    startDistribution();
  });

  restartBtn.addEventListener("click", () => {
    const dealerCont = document.querySelector(".dealer");
    const playersCont = document.querySelector(".players");
    dealerCont.innerHTML = "";
    playersCont.innerHTML = "";
    welcomeScreen.render();
    restartBtn.remove();
  });

  welcomeScreen.render();
};

start();
