"use strict";
const listOfCards = document.querySelector("#lista");
const shuffle = document.querySelector(".shuffle");
const topCard = document.querySelector("#top-card");

//GENERANDO ARRAY CON CARTAS

const cardGeneration = function () {
  const cardsArrGen = [];
  const clubs = ["clubs", "diamonds", "hearts", "spades"];
  const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
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

const cardsArr = cardGeneration();
console.log(cardsArr);

//FUNCION PARA REVOLVER CARTAS

const revolver = function (arr) {
  const arrCopy = arr.slice();

  let largo = arrCopy.length;
  let indexAleatorio;

  while (largo !== 0) {
    //generando un numero aleatorio entre 0 y el ultimo indice
    indexAleatorio = Math.round(Math.random() * (largo - 1));
    largo--;

    //cambiando ultimo numero con indice aleatorio
    let temp = arrCopy[largo];
    arrCopy[largo] = arrCopy[indexAleatorio];
    arrCopy[indexAleatorio] = temp;

    // [arrCopy[largo], arrCopy[indexAleatorio]] = [
    //   arrCopy[indexAleatorio],
    //   arrCopy[largo],
    // ];
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

const barajear = function () {
  listOfCards.innerHTML = "";
  const cardsArrRevuelto = revolver(cardsArr);
  const cardsListHtmlString = renderCards(cardsArrRevuelto);
  listOfCards.insertAdjacentHTML("afterbegin", cardsListHtmlString);

  //
  topCard.innerHTML = renderCards([cardsArrRevuelto[0]]);

  topCard.classList.remove("grey");
  topCard.classList.remove("pink");

  cardsArrRevuelto[0].suit === "hearts" ||
  cardsArrRevuelto[0].suit === "diamonds"
    ? topCard.classList.add("pink")
    : topCard.classList.add("grey");
};

shuffle.addEventListener("click", barajear);
