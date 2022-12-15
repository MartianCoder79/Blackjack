let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;
let deck;

let canHit = true; // allows the player to draw while playerSum <= 21.

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};

const buildDeck = () => {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  let types = ["C", "D", "H", "S"]; // Clubs, Diamonds, Hearts, Spades.

  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]); // A-C -> K-C; A-D -> K-D ; names of the cards will be "values-types".
    }
  }

  // console.log(deck);
};

const shuffleDeck = () => {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // Math.random gives a number between 0-1, which will be multiplied by the deck which is 52, gives a nr between 0-51.9999. Math.floor gets rid of the decimal.

    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  console.log(deck);
};

const startGame = () => {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  //   console.log(hidden);
  //   console.log(dealerSum);

  while (dealerSum < 17) {
    // while dealerSum is less then 17
    // creates img element and sets its source
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";

    // increments dealerSum and dealerAceCount and appends the new cardImg to the dealer-cards div
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
  }
  console.log("dealerSum ::: ", dealerSum);

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);
  }
  console.log("playerSum ::: ", playerSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("stay").addEventListener("click", stay);
};

const hit = () => {
  if (!canHit) {
    return;
  }
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  playerSum += getValue(card);
  playerAceCount += checkAce(card);
  document.getElementById("player-cards").append(cardImg);

  if (reduceAce(playerSum, playerAceCount) > 21) {
    canHit = false;
  }
};

const stay = () => {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  playerSum = reduceAce(playerSum, playerAceCount);

  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  // win/lose conditions
  let message = "";
  if (playerSum > 21) {
    message = "You Lose! 😢";
  } else if (dealerSum > 21) {
    message = "You Win! 🥳 ";
  }
  // both player and dealer <=21
  else if (playerSum === dealerSum) {
    message = "Tie! 🥴";
  } else if (playerSum > dealerSum) {
    message = "You Win! 🥳 ";
  } else if (playerSum < dealerSum) {
    message = "You Lose! 😢";
  }

  // appending the score and new-game button
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("player-sum").innerText = playerSum;
  document.getElementById("results").innerText = message;
  const btn = document.createElement("button");
  btn.setAttribute("id", "new-game");
  btn.innerText = "New Game";
  // let buttonsDiv = document.getElementsByClassName("buttons");
  document.body.appendChild(btn);
  document.getElementById("new-game").addEventListener("click", newGame);
};

const newGame = () => location.reload();

const getValue = (card) => {
  let data = card.split("-"); // Returns array by split(), populated with the split values and types, "4-C" -> ["4", "C"].
  let value = data[0];

  if (isNaN(value)) {
    // if value is not a number, meaning A, J, Q or K.
    if (value === "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value); // if it is a nr, returns the value.
};

const checkAce = (card) => {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
};

const reduceAce = (playerSum, playerAceCount) => {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
};
