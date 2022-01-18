import renderCards from "./RenderCard.js";

const dealerCards = document.querySelector("#dealer");
const playerCards = document.querySelector("#player");

//Helper funcitn, move it to another file if necessary
const sleepNow = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export default function distribuite(cardsArr, playersArr) {
  const cardsPlace = [playerCards, dealerCards];

  const amountOfPlayers = playersArr.length;
  const cardsToGive = 2 * amountOfPlayers;
  let playerToGetCard = 0;
  let cardToRender = 0;

  setTimeout((i) => i + 1, 1000);

  async function givingCards() {
    for (let i = 0; i < cardsToGive; i++) {
      let card = cardsArr.slice(i, i + 1);
      const currentPlayerBeingDealt = playersArr[playerToGetCard]

      if (i === cardsToGive - 1) {
        card.flipCard()
      }

      currentPlayerBeingDealt.receiveCard(card);

      cardsPlace[cardToRender].insertAdjacentHTML(
        "afterbegin",
        renderCards(card)
      );
      await sleepNow(1000);
      playerToGetCard++;
      cardToRender++;
      if (cardToRender === amountOfPlayers) cardToRender = 0;
      if (playerToGetCard === amountOfPlayers) playerToGetCard = 0;
    }
  }
  givingCards();
}
