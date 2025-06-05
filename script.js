const startBtn = document.getElementById('startBtn');
const cashoutBtn = document.getElementById('cashoutBtn');
const multiplierDisplay = document.getElementById('multiplier');
const statusDisplay = document.getElementById('status');
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

let animationId;
let multiplier = 1;
let running = false;
let crashed = false;
let cashout = false;
let crashPoint = 0;

const graphPoints = [];
const maxPoints = 600; // width of canvas in pixels

function getRandomCrashPoint() {
  // Crash point between 1.2x to 10x randomly (you can adjust)
  return (Math.random() * 8.8 + 1.2).toFixed(2);
}

function resetGame() {
  multiplier = 1;
  crashed = false;
  cashout = false;
  graphPoints.length = 0;
  statusDisplay.textContent = '';
  multiplierDisplay.textContent = '1.00x';
  cashoutBtn.disabled = true;
  startBtn.disabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw axis lines
  ctx.strokeStyle = '#415a77';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 0);
  ctx.lineTo(40, canvas.height - 30);
  ctx.lineTo(canvas.width, canvas.height - 30);
  ctx.stroke();

  // Draw multiplier curve
  ctx.strokeStyle = '#ffba08';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < graphPoints.length; i++) {
    let x = 40 + i;
    let y = canvas.height - 30 - graphPoints[i] * 20; // scale multiplier for graph height
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function updateGame() {
  if (crashed || cashout) {
    cancelAnimationFrame(animationId);
    if (crashed) {
      statusDisplay.textContent = `Crash! You lost. Crash at ${crashPoint}x`;
      multiplierDisplay.textContent = `${crashPoint}x`;
    } else if (cashout) {
      statusDisplay.textContent = `You cashed out at ${multiplier.toFixed(2)}x! Congrats!`;
      multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
    }
    startBtn.disabled = false;
    cashoutBtn.disabled = true;
    return;
  }

  multiplier += 0.01 + multiplier * 0.01; // speed up multiplier growth

  if (multiplier >= crashPoint) {
    crashed = true;
  } else {
    graphPoints.push(multiplier);
    if (graphPoints.length > maxPoints) {
      graphPoints.shift();
    }
    multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
    drawGraph();
    animationId = requestAnimationFrame(updateGame);
  }
}

startBtn.addEventListener('click', () => {
  resetGame();
  running = true;
  crashPoint = parseFloat(getRandomCrashPoint());
  startBtn.disabled = true;
  cashoutBtn.disabled = false;
  statusDisplay.textContent = 'Game started! Cash out before crash.';
  updateGame();
});

cashoutBtn.addEventListener('click', () => {
  if (!running || crashed || cashout) return;
  cashout = true;
  running = false;
});

document.getElementById('startBtn').addEventListener('click', function() {
  document.getElementById('adContainer').style.display = 'flex';
});

// एड बंद करने का बटन
document.getElementById('closeAd').addEventListener('click', function() {
  document.getElementById('adContainer').style.display = 'none';
});

document.getElementById('startBtn').addEventListener('click', function() {
  window.open('https://ads-link-yahan.com', '_blank');
});

