export default function renderCards(arr) {
  let htmlString = "";

  arr.forEach((card) => {
    if (card.face === "down") {
      htmlString = "Card down";
    } else {
      htmlString += `<p>${card.number} of ${card.suit} <i class="${card.icon}  "></i></p>`;
    }
  });

  return htmlString;
}
