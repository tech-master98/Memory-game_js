const tilesContainer = document.querySelector(".tiles");
const colors = ["aqua", "aquamarine", "crimson", "blue", "dodgerblue", "gold", "greenyellow", "teal"];
let colorsPicklist = [...colors, ...colors];
const tileCount = colorsPicklist.length;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;

// Load sound files
const matchSound = new Audio("matchcolor.wav"); // Replace with your actual file
const gameOverSound = new Audio("gamerest.wav"); // Replace with your actual file

function playMatchSound() {
    matchSound.play();
}

function playGameOverSound() {
    gameOverSound.play();
}

function buildTile(color) {
    const element = document.createElement("div");

    element.classList.add("tile");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");

        if (
            awaitingEndOfMove ||
            revealed === "true" ||
            element === activeTile
        ) {
            return;
        }

        // Reveal this color
        element.style.backgroundColor = color;

        if (!activeTile) {
            activeTile = element;
            return;
        }

        const colorToMatch = activeTile.getAttribute("data-color");

        if (colorToMatch === color) {
            element.setAttribute("data-revealed", "true");
            activeTile.setAttribute("data-revealed", "true");

            playMatchSound(); // Play match sound

            activeTile = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            if (revealedCount === tileCount) {
                setTimeout(() => {
                    playGameOverSound(); // Play game over sound
                    alert("You win! Restarting the game...");
                    resetGame();
                }, 500);
            }

            return;
        }

        awaitingEndOfMove = true;

        setTimeout(() => {
            activeTile.style.backgroundColor = null;
            element.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeTile = null;
        }, 1000);
    });

    return element;
}

function resetGame() {
    // Reset game state
    revealedCount = 0;
    activeTile = null;
    awaitingEndOfMove = false;
    colorsPicklist = [...colors, ...colors];

    // Clear the existing tiles
    tilesContainer.innerHTML = "";

    // Rebuild the tiles
    for (let i = 0; i < tileCount; i++) {
        const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
        const color = colorsPicklist[randomIndex];
        const tile = buildTile(color);

        colorsPicklist.splice(randomIndex, 1);
        tilesContainer.appendChild(tile);
    }
}

// Build up initial tiles
resetGame();