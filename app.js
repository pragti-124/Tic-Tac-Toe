let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let soundO = document.querySelector("#sound-o");
let soundX = document.querySelector("#sound-x");
let bgMusic = document.querySelector("#bg-music");

let turnO = true; // playerX, playerO
let count = 0; // To Track Draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Function to play background music
const playBgMusic = () => {
  return new Promise((resolve, reject) => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        resolve();
      }).catch((error) => {
        console.error("Background music play failed:", error);
        reject(error);
      });
    } else {
      resolve();
    }
  });
};

// Function to reset the game
const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");

  // Ensure the background music starts again
  playBgMusic().catch(error => {
    console.error("Error playing background music:", error);
  });
};

// Event listener for each box
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText === "") { // Only play sound if the box is empty
      if (turnO) {
        // playerO
        box.innerText = "O";
        soundO.play().catch(error => {
          console.error("Sound O play failed:", error);
        });
        turnO = false;
      } else {
        // playerX
        box.innerText = "X";
        soundX.play().catch(error => {
          console.error("Sound X play failed:", error);
        });
        turnO = true;
      }
      box.disabled = true;
      count++;

      let isWinner = checkWinner();

      if (count === 9 && !isWinner) {
        gameDraw();
      }
    }
  });
});

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  bgMusic.pause(); // Pause background music on draw
  bgMusic.currentTime = 0; // Reset music to start
};

const disableBoxes = () => {
  boxes.forEach(box => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  bgMusic.pause(); // Pause background music on win
  bgMusic.currentTime = 0; // Reset music to start
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false; // Ensure it returns false if no winner
};

// Add an event listener to start background music on user interaction
window.addEventListener('click', () => {
  playBgMusic().catch(error => {
    console.error("Error playing background music:", error);
  });
});

// Event listeners for buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
