"use strict";
import Board from "./Board.js";
import Player from "./Player.js";
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

  const welcomeScreen = new WelcomeScreen((players) => {
    const game = new Board();
    container.prepend(restartBtn);
    players.forEach((player) =>
      game.addPlayer(
        new Player({
          name: player.name,
          board: game,
          pot: 200,
          playerType: "GuestPlayer",
        })
      )
    );

    game.players.forEach((player) => {
      player.renderPlayer();
    });
    game.createDealer();

    game.startWithGameBets();

    restartBtn.addEventListener("click", () => {
      game.clearBoard();
      welcomeScreen.render();
      restartBtn.remove();
    });
  });

  welcomeScreen.render();
};

start();
