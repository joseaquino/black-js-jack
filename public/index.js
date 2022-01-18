"use strict";

import { cardGeneration } from "./Deck.js";
import Mix from "./Mix.js";
import Player from "./Player.js";
import distribuite from "./Distribue.js";

const start = document.querySelector("#start");

// TODO: Extract this class to its own file
class Board {
  constructor() {
    this.deck = cardGeneration(); //Generates deck of cards
    this.mixedDeck = Mix(this.deck); // Mixes deck of cards
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player)
  }

  getPlayers() {
    return this.players;
  }

  dealCards() {
    // TODO: Add logic for dealing cards to the players that have been added
  }

  renderPlayers() {
    // TODO: Add logic for rendering the each player to the DOM
  }
}

function InitiateGame() {
  //Creating a Board instance
  const game1 = new Board();

  //Creating Player1
  const player1 = new Player("Periquito", 5000, 'GuestPlayer');
  //Storing player1 inside players array
  game1.addPlayer(player1);

  //Creating Dealer MUST BE CREATER ALWAYS AT LAST
  const dealer = new Player("dealer", 20000, 'Dealer');
  dealer.setDomElement(document.querySelector("#dealer"))
  //Storing dealer inside players array
  game1.addPlayer(dealer);

  //Function to initiate cards distribution when pressing 'start'
  const startDistribution = () => {
    distribuite(game1.mixedDeck, game1.players);
    game1.getPlayers().forEach((player) => player.render())
    start.removeEventListener("click", startDistribution);
  };

  start.addEventListener("click", startDistribution);
}

InitiateGame();

//
// if (game1.players[0].hand.length === 2)
//   start.removeEventListener("click", () => {
//     distribuite(boardDeckMixed, game1.players);
//   });

/*
const listOfCards = document.querySelector("#list");
const shuffleBtn = document.querySelector(".shuffle");
const topCard = document.querySelector("#top-card");

//Generating cards array

const cardGeneration = function () {
  const cardsArrGen = [];
  const clubs = ["clubs", "diamonds", "hearts", "spades"];
  const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

  const cardsClubs = clubs.length;
  const differentCards = cards.length;

  for (let i = 0; i < cardsClubs; i++) {
    for (let j = 0; j < differentCards; j++) {
      const cardObj = {
        suit: clubs[i],
        number: cards[j],
        color: clubs[i] === "hearts" || clubs[i] === "spades" ? "red" : "black",
      };

      switch (cardObj.suit) {
        case "clubs":
          cardObj.icon = "fab fa-canadian-maple-leaf";
          break;
        case "diamonds":
          cardObj.icon = "fas fa-gem";
          break;
        case "hearts":
          cardObj.icon = "fas fa-heart";
          break;
        case "spades":
          cardObj.icon = "fas fa-candy-cane";
          break;
      }

      cardsArrGen.push(cardObj);
    }
  }
  return cardsArrGen;
};

//function to mix cards

const mix = function (arr) {
  const arrCopy = [...arr];

  let totalOfElements = arrCopy.length;
  let randomIndex;

  while (totalOfElements !== 0) {
    //generating a random number between 0 and last array element, [0, lastElement], inclusive
    randomIndex = Math.round(Math.random() * (totalOfElements - 1));
    totalOfElements--;

    //changing last element with random index
    let tempVariable = arrCopy[totalOfElements];
    arrCopy[totalOfElements] = arrCopy[randomIndex];
    arrCopy[randomIndex] = tempVariable;
  }
  return arrCopy;
};

const renderCards = function (arr) {
  let htmlString = "";

  arr.forEach((card) => {
    htmlString += `<p>${card.number} of ${card.suit} <i class="${card.icon}"></i></p>`;
  });

  return htmlString;
};

const shuffleFunction = function () {
  const cardsArr = cardGeneration();
  listOfCards.innerHTML = "";
  const cardsArrAfterMix = mix(cardsArr);
  const cardsListHtmlString = renderCards(cardsArrAfterMix);
  // listOfCards.insertAdjacentHTML("afterbegin", cardsListHtmlString);
  listOfCards.innerHTML = cardsListHtmlString;

  //
  topCard.innerHTML = renderCards([cardsArrAfterMix[0]]);

  topCard.classList.remove("grey");
  topCard.classList.remove("pink");

  cardsArrAfterMix[0].suit === "hearts" ||
  cardsArrAfterMix[0].suit === "diamonds"
    ? topCard.classList.add("pink")
    : topCard.classList.add("grey");
};

shuffleBtn.addEventListener("click", shuffleFunction);
*/
