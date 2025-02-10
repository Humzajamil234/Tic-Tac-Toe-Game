let board = Array(9).fill(null); // Array to keep track of the board state
let currentPlayer = 'X'; // Current player (X or O)
let gameOver = false;

const squares = document.querySelectorAll('.square');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinningSquares(pattern);
            return board[a];
        }
    }

    if (board.every(cell => cell !== null)) {
        return 'draw';
    }

    return null;
}

function highlightWinningSquares(pattern) {
    // Adding glowing effect and pulse animation to the winning squares
    pattern.forEach(index => {
        squares[index].classList.add('winning');
    });

    // Trigger confetti explosion
    triggerConfetti();

    // Draw a golden line over the winning pattern
    const line = document.createElement('div');
    line.classList.add('winning-line');
    document.getElementById('board').appendChild(line);

    const [a, b, c] = pattern;
    const center = squares[(a + b + c) / 3];

    setTimeout(() => {
        line.style.width = 'calc(100% + 50px)';
        line.style.transform = `translate(-50%, -50%) rotate(${calculateRotation(a, b, c)}deg)`;
    }, 200);

    gameOver = true;
}

function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
        let confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti');
        document.body.appendChild(confettiPiece);

        // Randomize confetti positions and animation
        confettiPiece.style.left = `${Math.random() * 100}vw`;
        confettiPiece.style.animationDuration = `${Math.random() * 1 + 1}s`;
        confettiPiece.style.animationDelay = `${Math.random() * 1}s`;
        confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;

        // Remove confetti after it has finished falling
        setTimeout(() => {
            confettiPiece.remove();
        }, 2000);
    }
}

function calculateRotation(a, b, c) {
    // Calculates rotation based on the winning line direction (horizontal, vertical, diagonal)
    if (a === 0 && b === 1 && c === 2 || a === 3 && b === 4 && c === 5 || a === 6 && b === 7 && c === 8) {
        return 0;
    } else if (a === 0 && b === 3 && c === 6 || a === 1 && b === 4 && c === 7 || a === 2 && b === 5 && c === 8) {
        return 90;
    } else if (a === 0 && b === 4 && c === 8 || a === 2 && b === 4 && c === 6) {
        return 45;
    } else {
        return 135;
    }
}

function handleClick(index) {
    if (gameOver || board[index] !== null) return;

    board[index] = currentPlayer;
    squares[index].textContent = currentPlayer;
    squares[index].classList.add(currentPlayer.toLowerCase());
    squares[index].style.animation = 'bounce 0.3s ease';

    const winner = checkWinner();
    if (winner) {
        if (winner === 'draw') {
            statusElement.textContent = 'It\'s a Draw!';
        } else {
            statusElement.textContent = `${winner} wins!`;
        }
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
}

squares.forEach((square, index) => {
    square.addEventListener('click', () => handleClick(index));
});

resetBtn.addEventListener('click', () => {
    board = Array(9).fill(null);
    gameOver = false;
    currentPlayer = 'X';
    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('x', 'o', 'winning');
        square.style.animation = '';
    });
    statusElement.textContent = `Player ${currentPlayer}'s turn`;

    const winningLine = document.querySelector('.winning-line');
    if (winningLine) {
        winningLine.remove();
    }
});
