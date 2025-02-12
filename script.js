class ConnectFour {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.currentPlayer = 1;
        this.gameActive = true;
        this.scores = { 1: 0, 2: 0 };
        
        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameBoard.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('gameBoard').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && this.gameActive) {
                const col = parseInt(e.target.dataset.col);
                this.makeMove(col);
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    makeMove(col) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return; // Column is full

        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);

        if (this.checkWin(row, col)) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
        }
    }

    getLowestEmptyRow(col) {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) return row;
        }
        return -1;
    }

    updateCell(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * this.COLS + col;
        cells[index].classList.add(`player${this.currentPlayer}`);
    }

    checkWin(row, col) {
        return (
            this.checkDirection(row, col, 0, 1) || // Horizontal
            this.checkDirection(row, col, 1, 0) || // Vertical
            this.checkDirection(row, col, 1, 1) || // Diagonal /
            this.checkDirection(row, col, 1, -1)   // Diagonal \
        );
    }

    checkDirection(row, col, rowDir, colDir) {
        const player = this.board[row][col];
        let count = 1;

        // Check forward direction
        for (let i = 1; i < 4; i++) {
            const newRow = row + rowDir * i;
            const newCol = col + colDir * i;
            if (!this.isValidPosition(newRow, newCol) || this.board[newRow][newCol] !== player) break;
            count++;
        }

        // Check backward direction
        for (let i = 1; i < 4; i++) {
            const newRow = row - rowDir * i;
            const newCol = col - colDir * i;
            if (!this.isValidPosition(newRow, newCol) || this.board[newRow][newCol] !== player) break;
            count++;
        }

        return count >= 4;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== 0);
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.showWinnerModal(`Player ${this.currentPlayer} Wins!`);
    }

    handleDraw() {
        this.gameActive = false;
        this.showWinnerModal("It's a Draw!");
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        document.getElementById('currentPlayer').textContent = `Player ${this.currentPlayer}'s Turn`;
    }

    updateScores() {
        document.getElementById('player1Score').textContent = this.scores[1];
        document.getElementById('player2Score').textContent = this.scores[2];
    }

    showWinnerModal(message) {
        const modal = document.getElementById('winnerModal');
        const winnerMessage = document.getElementById('winnerMessage');
        const winnerToken = document.querySelector('.winner-token');

        winnerMessage.textContent = message;
        winnerToken.className = 'winner-token';
        if (message.includes('Wins')) {
            winnerToken.classList.add(`player${this.currentPlayer}`);
        }

        modal.style.display = 'flex';
    }

    resetGame() {
        this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.currentPlayer = 1;
        this.gameActive = true;
        document.getElementById('currentPlayer').textContent = "Player 1's Turn";
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
        document.getElementById('winnerModal').style.display = 'none';
    }
}

// Initialize game
const game = new ConnectFour();

function startNewGame() {
    game.resetGame();
}
