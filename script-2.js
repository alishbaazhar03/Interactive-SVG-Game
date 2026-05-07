// Got an idea of how to make my code from this youtube:
//link https://www.youtube.com/watch?v=jj5ADM2uywg

/*I, Alishba Azhar, 000925324, certify that this material is my original work. 
*No other person's work has been used without due acknowledgment and 
* I have not made my work available to anyone else.*/

const svgNS = "http://www.w3.org/2000/svg";
const gameArea = document.getElementById("gameArea");
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

let bird, pipes = [], animationId, score = 0;
let pipeInterval;
let gameOver = false; 

// Initialize the game
function initGame() {
    score = 0;
    pipes = [];
    document.querySelector(".score").textContent = `Score: 0`;
    gameOver = false;

    // Clear any previously generated pipes from the game area
    gameArea.innerHTML = "";

    // Create the bird
    bird = document.createElementNS(svgNS, "circle");
    bird.setAttribute("cx", "50");
    bird.setAttribute("cy", "200");
    bird.setAttribute("r", "10");
    bird.setAttribute("fill", "yellow");
    bird.setAttribute("stroke", "black");
    gameArea.appendChild(bird);

    // Add key event listener for flying action
    document.addEventListener("keydown", fly);

    // Start spawning pipes and animating the game
    pipeInterval = setInterval(spawnPipe, 2000); // Spawn pipes every 2 seconds
    animate();
}

// Handle bird flying with spacebar
function fly(event) {
    if (event.code === "Space") {
        let currentY = parseInt(bird.getAttribute("cy"));
        bird.setAttribute("cy", Math.max(currentY - 50, 0));  // Restrict movement to top of the SVG
    }
}

// Spawn a new pair of pipes
function spawnPipe() {
    const gap = 100;
    const pipeHeight = Math.random() * 200 + 50;

    const topPipe = document.createElementNS(svgNS, "rect");
    topPipe.setAttribute("x", "800");
    topPipe.setAttribute("y", "0");
    topPipe.setAttribute("width", "50");
    topPipe.setAttribute("height", pipeHeight);
    topPipe.setAttribute("fill", "green");
    gameArea.appendChild(topPipe);

    const bottomPipe = document.createElementNS(svgNS, "rect");
    bottomPipe.setAttribute("x", "800");
    bottomPipe.setAttribute("y", pipeHeight + gap);
    bottomPipe.setAttribute("width", "50");
    bottomPipe.setAttribute("height", "500");
    bottomPipe.setAttribute("fill", "green");
    gameArea.appendChild(bottomPipe);

    pipes.push({ top: topPipe, bottom: bottomPipe });
}


// Animate the game (move pipes and the bird)
function animate() {
    const birdY = parseInt(bird.getAttribute("cy")) + 2;
    bird.setAttribute("cy", Math.min(birdY, 400));  // Restrict bird inside the SVG height

    pipes.forEach(pipe => {
        const x = parseInt(pipe.top.getAttribute("x")) - 2;

        if (x + 50 < 0) {
            gameArea.removeChild(pipe.top);
            gameArea.removeChild(pipe.bottom);
            pipes.shift();
            if (!gameOver) {
                score++;  // Only update score if the game is still running
                document.querySelector(".score").textContent = `Score: ${score}`;
            }
        } else {
            pipe.top.setAttribute("x", x);
            pipe.bottom.setAttribute("x", x);

            // Check for collision
            if (
                (x < 60 && x + 50 > 40) &&
                (birdY < parseInt(pipe.top.getAttribute("height")) ||
                    birdY > parseInt(pipe.bottom.getAttribute("y")))
            ) {
                endGame();
            }
        }
    });

    animationId = requestAnimationFrame(animate);  // Keep animating the game
}

// End the game on collision
function endGame() {
    gameOver = true; 
    const result = score;
    cancelAnimationFrame(animationId);  // Stop the animation loop
    clearInterval(pipeInterval);  // Stop spawning new pipes
    document.removeEventListener("keydown", fly);  // Remove key event listener
    finalScore.textContent = result;  // Display the final score
    gameOverPopup.classList.remove("hidden");  // Show the Game Over popup
}

// Restart the game
restartButton.addEventListener("click", () => {
    // Reset everything and stop previous animations
    pipes.forEach(pipe => {
        gameArea.removeChild(pipe.top);
        gameArea.removeChild(pipe.bottom);
    });
    pipes = [];  // Clear the pipes array

    cancelAnimationFrame(animationId);  // Stop the animation loop
    clearInterval(pipeInterval);  // Stop the pipe spawning interval
    document.removeEventListener("keydown", fly);  // Remove key event listener
    gameOverPopup.classList.add("hidden");  // Hide the Game Over popup

    initGame();  // Restart the game
});

// Start the game
initGame();
