"use strict";
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
