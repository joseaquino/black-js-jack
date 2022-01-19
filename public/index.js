"use strict";
import Board from "./Board.js";
import Player from "./Player.js";

const start = document.querySelector("#start");

function InitiateGame() {
  //Creating a Board instance
  const game1 = new Board();

  //Creating Player1
  const player1 = new Player("Periquito", 5000, "GuestPlayer");
  player1.renderPlayer();

  //Storing player1 inside players array
  game1.addPlayer(player1);

  const player2 = new Player("Javiles", 5000, "GuestPlayer");
  player2.renderPlayer();

  //Storing player2 inside players array
  game1.addPlayer(player2);

  const player3 = new Player("John", 5000, "GuestPlayer");
  player3.renderPlayer();

  //Storing player2 inside players array
  game1.addPlayer(player3);

  //DEALER CANNOT BE MODIFIED  AND ALWAYS HAS TO BE CREATED AT THE END
  game1.dealerCreation();

  //Function to initiate cards distribution when pressing 'start'
  const startDistribution = () => {
    game1.dealCards();
    start.removeEventListener("click", startDistribution);
  };

  start.addEventListener("click", startDistribution);
}

InitiateGame();
