const rowSize = 3;
const numOfTiles = rowSize * rowSize;
const emptyTile = "e";
let count = 0;
let winner;
let tileArrangement = [];
let emptyTilePos;
let animationRunning = false;
// let tileIndex;

const puzzle = document.querySelector(".puzzle");
const countDisplay = document.getElementById("count");
const messageDisplay = document.getElementById("message");
const playGameButton = document.querySelector(".play");

// board.addEventListener("click", transitgrid);

// function playTile(tileLocation) {
//   if (
//     // Check that tile is either top, bottom, left or right of empty tile, else nothing happens. Take care of boundary cases
//     tileLocation - rowSize === emptyTilePos ||
//     tileLocation + rowSize === emptyTilePos ||
//     (tileLocation - 1 === emptyTilePos && tileLocation % rowSize !== 1) ||
//     (tileLocation + 1 === emptyTilePos && tileLocation % rowSize !== 0)
//   ) {
//     // Update array and all other variables
//     tileArrangement[emptyTilePos - 1] = tileArrangement[tileLocation - 1];
//     emptyTilePos = tileLocation;
//     tileArrangement[tileLocation - 1] = emptyTile;
//     count++;

//     updateCountDisplay();
//     updatePuzzle();
//     winner = checkSolved();
//   }
// }

function playTile(tileLocation) {
  if (tileLocation - rowSize === emptyTilePos) {
    animateMove(tileLocation, "Up");
  } else if (tileLocation + rowSize === emptyTilePos) {
    animateMove(tileLocation, "Down");
  } else if (
    tileLocation - 1 === emptyTilePos &&
    tileLocation % rowSize !== 1
  ) {
    animateMove(tileLocation, "Left");
  } else if (
    tileLocation + 1 === emptyTilePos &&
    tileLocation % rowSize !== 0
  ) {
    animateMove(tileLocation, "Right");
  }
}
// This moves two tiles, the tile of play and the empty tile
function animateMove(tileLocation, action) {
  const tileNumber = tileArrangement[tileLocation - 1];
  const tileElement = document.getElementById("tile_" + tileNumber);
  if (!tileNumber) {
    return;
  } else {
    animationRunning = true;
  }
  switch (action) {
    case "Down":
      tileElement.style.transform = "translateY(200px)";
      break;
    case "Up":
      tileElement.style.transform = "translateY(-200px)";
      break;
    case "Left":
      tileElement.style.transform = "translateX(-200px)";
      break;
    case "Right":
      tileElement.style.transform = "translateX(200px)";
      break;
  }
  count++;
  tileElement.addEventListener(
    "transitionend",
    () => {
      // Update array and all other variables
      tileElement.style.transform = "";
      tileArrangement[emptyTilePos - 1] = tileArrangement[tileLocation - 1];
      emptyTilePos = tileLocation;
      tileArrangement[tileLocation - 1] = emptyTile;
      animationRunning = false;

      updateCountDisplay();
      updatePuzzle();
      winner = checkSolved();
    },
    { once: true }
  );
}

function scramble() {
  for (let i = 0; i < tileArrangement.length; i++) {
    const j = Math.floor(Math.random() * numOfTiles);
    const temp = tileArrangement[i];
    tileArrangement[i] = tileArrangement[j];
    tileArrangement[j] = temp;
  }

  // Update empty tile position
  emptyTilePos = tileArrangement.findIndex((item) => item === emptyTile) + 1;
  if (!checkPuzzleIsValid()) {
    fixUnsolvablePuzzle();
  }
}

function checkPuzzleIsValid() {
  // Count the number of inversions (needs to be even NOTE: this applies to 3 by 3 puzzles, may not work on other size)
  // Ignore the empty tile (Do not do any operation with them)
  let inversionCount = 0;
  for (let i = 0; i < tileArrangement.length - 1; i++) {
    if (tileArrangement[i] === emptyTile) continue;

    for (let j = i + 1; j < tileArrangement.length; j++) {
      if (tileArrangement[j] === emptyTile) continue;
      if (tileArrangement[i] > tileArrangement[j]) {
        inversionCount++;
      }
    }
  }
  if (inversionCount % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

function fixUnsolvablePuzzle() {
  // Swap 2 neighbouring array elements to increase or reduce the number of inversions by 1
  // Only perform on elments that does not include the empty tile
  if (tileArrangement[0] !== emptyTile && tileArrangement[1] !== emptyTile) {
    swapArrElement(0, 1); // Swap first and second elements
  } else {
    swapArrElement(tileArrangement.length - 2, tileArrangement.length - 1); // Swap last two elements
  }
}

function swapArrElement(index1, index2) {
  const temp = tileArrangement[index1];
  tileArrangement[index1] = tileArrangement[index2];
  tileArrangement[index2] = temp;
}

function init() {
  count = 0;
  tileArrangement = [];
  for (let i = 0; i < numOfTiles - 1; i++) {
    tileArrangement.push(i + 1);
  }
  tileArrangement.push(emptyTile); //empty tile
  emptyTilePos = numOfTiles;
  winner = false;
  updateCountDisplay();
  UpdateMessageDisplay();
}

function UpdateMessageDisplay(message = "") {
  messageDisplay.innerText = message;
}

function updatePuzzle() {
  let updatedId;
  for (let i = 0; i < numOfTiles; i++) {
    updatedId = "tile_" + tileArrangement[i];
    puzzle.children[i].setAttribute("id", updatedId);
    puzzle.children[i].textContent = tileArrangement[i];
  }
}

function updateCountDisplay() {
  countDisplay.innerText = count;
}

function playMove(event) {
  if (winner || animationRunning) {
    return;
  }
  const sqrLocation = event.target;
  if (sqrLocation.classList.contains("tile")) {
    const tileIndex = Number(sqrLocation.id[5]); // 5th character of string (tile_)
    const tileLocation =
      tileArrangement.findIndex((item) => item === tileIndex) + 1;
    if (tileLocation) {
      playTile(tileLocation);
      // console.log("Action", sqrLocation.id[5]);
    } else {
      // console.log("NULL", tileIndex, tileLocation);
      // console.log(sqrLocation);
    }
  }
}

function checkSolved() {
  for (let i = 0; i < tileArrangement.length - 2; i++) {
    if (tileArrangement[i + 1] !== tileArrangement[i] + 1) {
      return false;
    }
  }
  if (tileArrangement[tileArrangement.length - 1] !== emptyTile) {
    return false;
  }
  UpdateMessageDisplay("You win!");
  return true;
}

// test = new Audio();

function start() {
  if (animationRunning) return;
  init();
  scramble();
  updatePuzzle();
}

puzzle.addEventListener("click", playMove);
playGameButton.addEventListener("click", start);
