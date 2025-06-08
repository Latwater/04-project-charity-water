console.log('Charity Water Project script loaded.');

const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const feedback = document.getElementById('feedback');
const startBtn = document.getElementById('start-btn');

let score = 0;
let timeLeft = 30;
let gameInterval = null;
let dropInterval = null;
let gameActive = false;

function randomX() {
    // Keep drops within game area
    return Math.floor(Math.random() * (gameArea.clientWidth - 36));
}

function createDrop() {
    const isWater = Math.random() < 0.7; // 70% water, 30% pollutant
    const drop = document.createElement('div');
    drop.className = isWater ? 'water-drop' : 'pollutant-drop';
    drop.style.left = randomX() + 'px';
    drop.style.top = '-48px';
    drop.dataset.type = isWater ? 'water' : 'pollutant';

    drop.addEventListener('click', function handleClick() {
        if (!gameActive) return;
        if (drop.dataset.type === 'water') {
            score++;
            showFeedback('Great! +1', true);
        } else {
            score = Math.max(0, score - 1);
            showFeedback('Oops! -1', false);
        }
        updateScore();
        drop.remove();
    });

    gameArea.appendChild(drop);

    // Animate drop falling
    let y = -48;
    const speed = isWater ? 2.5 : 2; // px per frame
    function fall() {
        if (!gameActive) {
            drop.remove();
            return;
        }
        y += speed;
        drop.style.top = y + 'px';
        if (y > gameArea.clientHeight) {
            // Drop missed
            if (drop.dataset.type === 'water') {
                // Optional: penalty for missing water drops
                // score = Math.max(0, score - 1);
                // showFeedback('Missed! -1', false);
                // updateScore();
            }
            drop.remove();
        } else {
            requestAnimationFrame(fall);
        }
    }
    requestAnimationFrame(fall);
}

function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

function updateTimer() {
    timerDisplay.textContent = 'Time: ' + timeLeft;
}

function showFeedback(msg, positive) {
    feedback.textContent = msg;
    feedback.style.color = positive ? '#ffd600' : '#888';
    setTimeout(() => {
        feedback.textContent = '';
    }, 800);
}

function startGame() {
    score = 0;
    timeLeft = 30;
    updateScore();
    updateTimer();
    feedback.textContent = '';
    gameArea.innerHTML = '';
    gameActive = true;
    startBtn.disabled = true;

    // Drop generator
    dropInterval = setInterval(createDrop, 700);

    // Timer
    gameInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    feedback.textContent = `Game Over! Final Score: ${score}`;
    startBtn.disabled = false;
}

startBtn.addEventListener('click', () => {
    if (!gameActive) startGame();
});