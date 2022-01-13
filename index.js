"use strict";
const mainContainer = document.querySelector("#app");
const listOfCards = document.querySelector("#lista");
const shuffle = document.querySelector(".shuffle");
const topCard = document.querySelector("#top-card");

const cardsArr = [];
const clubs = ["clubs", "diamonds", "hearts", "spades"];
const cards = ["As", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

//GENERANDO ARRAY CON CARTAS
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 13; j++) {
    let cardObj = {
      suit: clubs[i],
      number: cards[j],
      color: clubs[i] === "hearts" || clubs[i] === "spades" ? "red" : "black",
    };

    cardsArr.push(cardObj);
  }
}

//FUNCION PARA REVOLVER CARTAS

const revolver = function (arr) {
  let largo = arr.length;
  let indexAleatorio;

  while (largo !== 0) {
    //generando un numero aleatorio entre 0 y el ultimo indice
    indexAleatorio = Math.round(Math.random() * (largo - 1));
    largo--;

    //cambiando ultimo numero con indice aleatorio

    [arr[largo], arr[indexAleatorio]] = [arr[indexAleatorio], arr[largo]];
  }
  return arr;
};

const barajear = function () {
  const cardsArrRevuelto = revolver(cardsArr);

  let cardsListHtmlString = "";
  let icon;

  cardsArrRevuelto.forEach((card) => {
    switch (card.suit) {
      case "clubs":
        icon = "fab fa-canadian-maple-leaf";
        break;
      case "diamonds":
        icon = "fas fa-gem";
        break;
      case "hearts":
        icon = "fas fa-heart";
        break;
      case "spades":
        icon = "fas fa-candy-cane";
        break;
    }

    return (cardsListHtmlString += `<p>${card.number} of ${card.suit} <i class="${icon}"></i></p>`);
  });

  listOfCards.insertAdjacentHTML("afterbegin", cardsListHtmlString);
  topCard.innerHTML = `<p>${cardsArrRevuelto[0].number} of ${cardsArrRevuelto[0].suit} `;
  topCard.style.backgroundColor =
    cardsArrRevuelto[0].suit === "hearts" ||
    cardsArrRevuelto[0].suit === "spades"
      ? "red"
      : "grey";
};

shuffle.addEventListener("click", barajear);
