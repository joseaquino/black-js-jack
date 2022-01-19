"use strict";
import Board from "./Board.js";
import Player from "./Player.js";

const start = document.querySelector("#start");

function InitiateGame() {
  //Creating a Board instance
  const game1 = new Board();

  //Creating Player1
  const player1 = new Player("Periquito", 5000, "GuestPlayer");
  player1.renderPlayerHtml('.players');
  //Storing player1 inside players array
  game1.addPlayer(player1);

  const player2 = new Player("Javiles", 5000, "GuestPlayer");
  player2.renderPlayerHtml('.players');
  //Storing player2 inside players array
  game1.addPlayer(player2);

  const player3 = new Player("John", 5000, "GuestPlayer");
  player3.renderPlayerHtml('.players');
  //Storing player2 inside players array
  game1.addPlayer(player3);

  //DEALER CANNOT BE MODIFIED  AND ALWAYS HAS TO BE CREATED AT THE END
  game1.dealerCreation();

  //LEAVING THIS JUST AS TEMPORARY REFERENCE
  // //Creating Dealer MUST BE CREATER ALWAYS AT LAST
  // const dealer = new Player("Dealer", 20000, "Dealer");
  // dealer.setDomElement("Dealer");
  // //Storing player1 inside players array
  // game1.addPlayer(dealer);

  //Function to initiate cards distribution when pressing 'start'
  const startDistribution = () => {
    game1.dealCards(game1.mixedDeck, game1.players);
    game1.getPlayers().forEach((player) => player.render());
    start.removeEventListener("click", startDistribution);
  };

  start.addEventListener("click", startDistribution);
}

InitiateGame();
