"use strict";
import WelcomeScreen from "./WelcomeScreen.js";

const start = () => {
  const container = document.querySelector("#game")

  if (!container) {
    throw new Error("Container with ID game is missing in the document, make sure to include this in your index.html")
  }

  const restartBtn = document.createElement('button')
  restartBtn.innerHTML = 'Choose new players'

  const welcomeScreen = new WelcomeScreen((players) => {
    container.append(restartBtn)
    console.log("Players", players)
  })

  restartBtn.addEventListener('click', () => {
    welcomeScreen.render()
    restartBtn.remove()
  })


  console.info('Rendering Welcome Screen :)')
  welcomeScreen.render();

};

start();