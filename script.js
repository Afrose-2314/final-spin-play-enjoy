// ===== LOGIN FUNCTION =====
function loginUser() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username && password) {
        localStorage.setItem("username", username);
        window.location.href = "index.html";
    } else {
        alert("Please enter both username and password.");
    }
}

// ===== SPIN FUNCTION =====
let selectedGame = null;
function spinWheel() {
    const wheel = document.getElementById("wheel").querySelector("img");
    const games = ["speed.html", "memory.html", "quiz.html", "math.html", "typing.html"];
    
    const randomIndex = Math.floor(Math.random() * games.length);
    selectedGame = games[randomIndex];

    const spinDegrees = 360 * 5 + (randomIndex * (360 / games.length));
    wheel.style.transform = `rotate(${spinDegrees}deg)`;
    wheel.style.transition = "transform 5s ease-in-out";

    setTimeout(() => {
        showGameInstructions(selectedGame);
    }, 5200);
}

// ===== SHOW GAME INSTRUCTIONS =====
function showGameInstructions(game) {
    const popup = document.createElement("div");
    popup.classList.add("instruction-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Game Instructions</h2>
            <p>Complete the challenge within the time limit to win!</p>
            <button id="startGameBtn">Start Game</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("startGameBtn").addEventListener("click", () => {
        window.location.href = game;
    });
}

// ===== TIMER FUNCTIONS =====
let gameTimer;
function startGameTimer(seconds) {
    gameTimer = setTimeout(() => {
        alert("Time's up! Returning to the spin page.");
        window.location.href = "index.html";
    }, seconds * 1000);
}
function stopGameTimer() {
    clearTimeout(gameTimer);
}
