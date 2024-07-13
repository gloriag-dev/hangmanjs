//Msc
let hiddenWord = "";
let chosenCategory = "";
let lettersAlreadyChosen = [];
let animationCount = 0;
let wrongGuesses = 0;
let correctGuesses = 0;
let health = 100;
let gameOver = false;
let correctGuess = false;

//Selectors
let healthBar = document.querySelector(".progress-bar");
let homeScreen = document.querySelector(".home-screen-container");
let hiddenWordContainer = document.querySelector(".hidden-word-container");
let categoryContainer = document.querySelector(".category-container");
let gameScreen = document.querySelector(".game-screen");
let gameScreenHeader = document.querySelector(".game-screen-header");
let homeScreenHeader = document.querySelector(".menu-header");
let homeScreenHeaderTitle = document.querySelector(".menu-header-title");
let howToScreen = document.querySelector(".how-to-container");
let pauseMenuScreen = document.querySelector(".pause-menu-container");
let pauseMenuHeading = document.querySelector(".pause-menu-heading");
let categoryHeader = document.querySelector(".category-header");

/* Buttons */
let chooseCategoryBtn = document.querySelectorAll(".category-btn");
let howToBtn = document.querySelector(".how-to-btn");
let guessLetterBtn = document.querySelectorAll(".key-btn");
let backBtn = document.querySelector(".back-btn");
let playBtn = document.querySelector(".play-btn");
let pauseMenuBtn = document.querySelector(".pause-menu-btn");
let continueGameBtn = document.querySelector(".continue-game-btn");
let newCategoryBtn = document.querySelector(".new-category-btn");
let quitGameBtn = document.querySelector(".quit-game-btn");

/* Event Listeners */
playBtn.addEventListener("click", toggleCategory);
backBtn.addEventListener("click", goBack);
howToBtn.addEventListener("click", toggleHowTo);
howToBtn.addEventListener("click", toggleHowTo);
pauseMenuBtn.addEventListener("click", function () {
  togglePauseMenu();
});
newCategoryBtn.addEventListener("click", function () {
  togglePauseMenu();
  toggleCategory();
  gameScreenHeader.classList.add("display-none");
  gameScreen.classList.add("display-none");
});

continueGameBtn.addEventListener("click", function () {
  togglePauseMenu();
  if (gameOver) {
    startGame(chosenCategory);
  }
});

quitGameBtn.addEventListener("click", function () {
  togglePauseMenu();
  homeScreen.classList.remove("display-none");
  gameScreenHeader.classList.add("display-none");
  gameScreen.classList.add("display-none");
});

chooseCategoryBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    chosenCategory = this.value;
    startGame(chosenCategory);
    homeScreenHeader.classList.toggle("display-none");
    gameScreenHeader.classList.remove("display-none");
  });
});

guessLetterBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (!this.classList.contains("inactive-key")) {
      this.classList.add("inactive-key");
      this.tabIndex = "-1";
      checkLetter(this.value);
    }
  });
});

/* Functions */
function toggleCategory() {
  homeScreen.classList.add("display-none");
  categoryContainer.classList.toggle("display-none");
  homeScreenHeader.classList.toggle("display-none");
  homeScreenHeaderTitle.innerHTML = "Pick a Category";
}

function goBack() {
  homeScreen.classList.remove("display-none");
  howToScreen.classList.add("display-none");
  homeScreenHeader.classList.add("display-none");
  categoryContainer.classList.add("display-none");
}

function toggleHowTo() {
  homeScreen.classList.add("display-none");
  howToScreen.classList.toggle("display-none");
  homeScreenHeader.classList.toggle("display-none");
  homeScreenHeaderTitle.innerHTML = "How to Play";
}

function togglePauseMenu() {
  pauseMenuScreen.classList.toggle("display-none");
}

function checkLetter(letter) {
  for (let i = 0; i < hiddenWord.length; i++) {
    if (letter === hiddenWord[i]) {
      console.log(letter);
      const letterTile = hiddenWordContainer.children[i].querySelector(
        ".hidden-letter-inner"
      );
      letterTile.classList.add("reveal-letter");
      correctGuess = true;
      correctGuesses += 1;
    }
  }

  if (!correctGuess) {
    health -= 12.5;
    wrongGuesses += 1;
  } else {
    correctGuess = false;
  }
  healthBar.style.width = health + "%";

  if (wrongGuesses >= 8) {
    loseGame();
  } else if (correctGuesses == hiddenWord.length) {
    winGame();
  }
}

function startGame(category) {
  categoryHeader.innerHTML = category;
  continueGameBtn.innerHTML = "<h4>Continue</h4>";
  pauseMenuHeading.innerHTML = "Paused";
  hiddenWord = "";
  lettersAlreadyChosen = [];
  animationCount = 0;
  wrongGuesses = 0;
  correctGuesses = 0;
  health = 100;
  correctGuess = false;
  gameOver = false;
  hiddenWordContainer.innerHTML = "";
  healthBar.style.width = health + "%";

  for (let i = 0; i < guessLetterBtn.length; i++) {
    guessLetterBtn[i].classList.remove("inactive-key");
  }

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const randNum = Math.floor(
        Math.random() * data.categories[category].length
      );
      hiddenWord = data.categories[category][randNum].name.toLowerCase();
      console.log(hiddenWord);

      populateWord(hiddenWord);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function populateWord(word) {
  for (let i = 0; i < word.length; i++) {
    const hiddenLetterTile = document.createElement("div");
    hiddenLetterTile.classList.add("hidden-letter-tile");
    if (word[i] === " ") {
      hiddenLetterTile.classList.add("hidden");
      correctGuesses += 1;
    }

    const hiddenLetterInner = document.createElement("div");
    hiddenLetterInner.classList.add("hidden-letter-inner");

    const hiddenLetterFront = document.createElement("div");
    hiddenLetterFront.classList.add("hidden-letter-front");

    const hiddenLetterBack = document.createElement("div");
    hiddenLetterBack.classList.add("hidden-letter-back");

    const h2 = document.createElement("h2");
    h2.textContent = word[i];

    hiddenLetterBack.appendChild(h2);
    hiddenLetterInner.appendChild(hiddenLetterFront);
    hiddenLetterInner.appendChild(hiddenLetterBack);
    hiddenLetterTile.appendChild(hiddenLetterInner);

    const hiddenWordContainer = document.querySelector(
      ".hidden-word-container"
    );
    hiddenWordContainer.appendChild(hiddenLetterTile);
  }

  categoryContainer.classList.add("display-none");
  gameScreen.classList.remove("display-none");
}

function loseGame() {
  for (let i = 0; i < hiddenWord.length; i++) {
    const letterTile = hiddenWordContainer.children[i].querySelector(
      ".hidden-letter-inner"
    );
    letterTile.classList.add("reveal-letter");
  }
  continueGameBtn.innerHTML = "<h4>Play Again</h4>";
  pauseMenuHeading.innerHTML = "You Lose";
  gameOver = true;
  setTimeout(togglePauseMenu, 1500);
}

let animationInterval;

function winGame() {
  gameOver = true;
  continueGameBtn.innerHTML = "<h4>Play Again</h4>";
  pauseMenuHeading.innerHTML = "You Win";
  animationInterval = setInterval(addAnimation, 75);
}

function addAnimation() {
  const tile = document.querySelectorAll(".hidden-letter-tile");
  if (animationCount < tile.length) {
    tile[animationCount].classList.add("animated-tile");
    animationCount += 1;
  } else {
    clearInterval(animationInterval);
    setTimeout(togglePauseMenu, 500);
  }
}
