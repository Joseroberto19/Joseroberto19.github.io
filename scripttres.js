// Variables
const board = document.getElementById('board');
const message = document.getElementById('message');
const cells = [];
let currentPlayer = 'X';
let winner = null;
let difficulty = 'easy';

// Dificultad
function changeDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    resetGame();
}

// Inicializar el tablero
function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
            cells.push(cell);
        }
    }
}
function addCellListeners() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

// Reiniciar el juego
function resetGame() {
    winner = null;
    currentPlayer = 'X';
    message.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
    initBoard();
    window.location.reload();; // Agregar event listeners después de reiniciar el juego
    if (currentPlayer === 'O') {
        computerMove();
    }
}
// Manejar clic en la celda
function handleCellClick() {
    if (!winner && this.textContent === '') {
        this.textContent = currentPlayer;
        this.classList.add('show'); // Agregar clase para mostrar contenido con transición
        if (checkWinner()) {
            winner = currentPlayer;
            message.textContent = `${winner} ha ganado!`;
            cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            setTimeout(() => {
                window.location.reload(); // Reiniciar la página después de un breve retraso
            }, 1500); // 1500 milisegundos = 1.5 segundos
        } else if (checkDraw()) {
            message.textContent = 'Empate!';
            setTimeout(() => {
                window.location.reload(); // Reiniciar la página después de un breve retraso
            }, 1500); // 1500 milisegundos = 1.5 segundos
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                if (difficulty === 'easy') {
                    computerMoveEasy();
                } else if (difficulty === 'medium') {
                    computerMoveMedium();
                } else if (difficulty === 'hard') {
                    computerMoveHard();
                }
            }
        }
    }
}




// Verificar ganador
function checkWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let line of lines) {
        if (cells[line[0]].textContent !== '' &&
            cells[line[0]].textContent === cells[line[1]].textContent &&
            cells[line[0]].textContent === cells[line[2]].textContent) {
            cells[line[0]].classList.add('winner');
            cells[line[1]].classList.add('winner');
            cells[line[2]].classList.add('winner');
            return true;
        }
    }
    return false;
}

// Verificar empate
function checkDraw() {
    return cells.every(cell => cell.textContent !== '');
}

// Movimiento de la computadora (fácil)
function computerMoveEasy() {
    const emptyCells = cells.filter(cell => cell.textContent === '');
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = 'O';
    randomCell.classList.add('show');
    if (checkWinner()) {
        winner = 'O';
        message.textContent = `${winner} ha ganado!`;
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        setTimeout(() => {
            window.location.reload(); // Reiniciar la página después de un breve retraso
        }, 1500); // 1500 milisegundos = 1.5 segundos
    } else if (checkDraw()) {
        message.textContent = 'Empate!';
        setTimeout(() => {
            window.location.reload(); // Reiniciar la página después de un breve retraso
        }, 1500); // 1500 milisegundos = 1.5 segundos
    } else {
        currentPlayer = 'X';
    }
}

// Movimiento de la computadora (medio)
function computerMoveMedium() {

    computerMoveEasy();
}

// Movimiento de la computadora (difícil)
function computerMoveHard() {

    computerMoveEasy();
}



// Inicializar el juego
initBoard();
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const root = document.documentElement;

    if (darkModeToggle.checked) {
        root.style.setProperty('--bg-color-light', '#333');
        root.style.setProperty('--bg-color-dark', '#f5f5f5');
        root.style.setProperty('--text-color-light', '#f5f5f5');
        root.style.setProperty('--text-color-dark', '#333');
    } else {
        root.style.setProperty('--bg-color-light', '#f5f5f5');
        root.style.setProperty('--bg-color-dark', '#333');
        root.style.setProperty('--text-color-light', '#333');
        root.style.setProperty('--text-color-dark', '#f5f5f5');
    }
}