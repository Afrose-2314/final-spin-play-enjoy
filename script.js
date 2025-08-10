const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultText = document.getElementById('result');

const segments = ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"];
const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FFC300"];

let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// Draw wheel function
function drawWheel() {
    ctx.clearRect(0, 0, 400, 400);
    for (let i = 0; i < segments.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arc, false);
        ctx.lineTo(200, 200);
        ctx.fill();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText(segments[i], 110, 10);
        ctx.restore();
    }

    // Pointer arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(190, 0);
    ctx.lineTo(210, 0);
    ctx.lineTo(200, 40);
    ctx.closePath();
    ctx.fill();
}

// Spin logic
function rotateWheel() {
    spinTime += 20;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 20);
}

function easeOut(t, b, c, d) {
    let ts = (t /= d) * t;
    let tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd) % segments.length;
    resultText.innerText = "You got: " + segments[index];
}

spinBtn.addEventListener("click", () => {
    spinAngleStart = Math.random() * 10 + 10; // initial speed
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // total spin time
    rotateWheel();
});

// Initial draw
drawWheel();
