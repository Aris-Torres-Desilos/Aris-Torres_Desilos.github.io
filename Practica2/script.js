let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let playerTurn = true;
let startTime;
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('restart').addEventListener('click', restartGame);
loadLeaderboard();

function handleCellClick(event) {
    if (!playerTurn || !gameActive) return;

    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameBoard[clickedIndex] !== "") {
        return;
    }

    if (!startTime) startTime = new Date().getTime();

    gameBoard[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    playerTurn = false;

    if (checkWinner()) {
        gameActive = false;
        if (currentPlayer === "X") {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000;
            const playerName = prompt("¡Felicidades! Ganaste. Ingresa tu nombre:");
            if (playerName) {
                saveScore(playerName, duration);
            }
            loadLeaderboard();
        }
        return;
    }

    currentPlayer = "O";
    setTimeout(computerMove, 500);
}

function computerMove() {
    let availableCells = gameBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (availableCells.length === 0) {
        return;
    }

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameBoard[randomIndex] = "O";
    document.querySelector(`.cell[data-index="${randomIndex}"]`).textContent = "O";

    if (checkWinner()) {
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    playerTurn = true;
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            alert(`Jugador ${currentPlayer} ha ganado!`);
            return true;
        }
    }
    if (!gameBoard.includes("")) {
        alert("Empate!");
        gameActive = false;
        return true;
    }
    return false;
}

function restartGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    playerTurn = true;
    currentPlayer = "X";
    startTime = null;
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = "");
}

function saveScore(playerName, time) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: playerName, time: time, date: new Date().toLocaleString() });
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = leaderboard.map(entry => 
        `<tr>
            <td>${entry.name}</td>
            <td>${entry.time}s</td>
            <td>${entry.date}</td>
        </tr>`
    ).join('');
}
