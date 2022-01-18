export default function mix(arr) {
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
}
