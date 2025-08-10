/* ===== Login Page ===== */
function handleLogin() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter your username.");
        return;
    }
    sessionStorage.setItem("sp_user", username);
    window.location.href = "index.html";
}

/* ===== Spinner Page ===== */
let spinning = false;
let spinAngle = 0;
let spinTimeout = null;
let games = [
    { name: "Speed Typing", file: "color.html" },
    { name: "Memory Game", file: "memory.html" },
    { name: "Quiz Game", file: "quiz.html" },
    { name: "Math Challenge", file: "math.html" },
    { name: "Puzzle Game", file: "puzzle.html" }
];

function drawWheel() {
    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    const numSegments = games.length;
    const arc = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        let angle = i * arc;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, 150, angle, angle + arc, false);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ffeb99";
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Arial";
        ctx.fillText(games[i].name, 140, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    let spins = Math.floor(Math.random() * 5) + 5; // 5 to 9 spins
    let finalAngle = Math.random() * 360;
    let totalRotation = (spins * 360) + finalAngle;
    let currentRotation = 0;

    let spinInterval = setInterval(() => {
        currentRotation += 20;
        spinAngle = currentRotation;
        drawRotatedWheel(spinAngle);
        if (currentRotation >= totalRotation) {
            clearInterval(spinInterval);
            spinning = false;
            goToSelectedGame(spinAngle);
        }
    }, 20);
}

function drawRotatedWheel(angle) {
    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();
}

function goToSelectedGame(angle) {
    let segmentAngle = 360 / games.length;
    let selectedIndex = Math.floor(((360 - (angle % 360)) % 360) / segmentAngle);
    let selectedGame = games[selectedIndex];

    setTimeout(() => {
        showGameInstructions(selectedGame);
    }, 500);
}

function showGameInstructions(game) {
    alert(`You got "${game.name}"! Click OK to start.`);
    window.location.href = game.file;
}

/* ===== Page Loads ===== */
window.onload = function () {
    if (document.getElementById("wheelCanvas")) {
        drawWheel();
    }
};
