class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isComputerGame = false;
        this.computerPlayer = 'O';
        this.humanPlayer = 'X';
        this.difficulty = 'medium';
        
        this.statusDisplay = document.querySelector('.game-status');
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.getElementById('resetBtn');
        this.vsPlayerBtn = document.getElementById('vsPlayerBtn');
        this.vsBotBtn = document.getElementById('vsBotBtn');
        this.difficultySelector = document.getElementById('difficulty-selector');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
            cell.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleCellClick(cell);
            });
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.vsPlayerBtn.addEventListener('click', () => this.setGameMode(false));
        this.vsBotBtn.addEventListener('click', () => this.setGameMode(true));
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setDifficulty(btn.id.replace('Btn', ''));
            });
        });
    }

    setGameMode(isBot) {
        this.isComputerGame = isBot;
        this.vsPlayerBtn.classList.toggle('active', !isBot);
        this.vsBotBtn.classList.toggle('active', isBot);
        this.difficultySelector.classList.toggle('hidden', !isBot);
        
        this.resetGame();
        
        if (isBot && this.currentPlayer === 'O') {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    setDifficulty(level) {
        this.difficulty = level.toLowerCase();
        this.difficultyBtns.forEach(btn => {
            btn.classList.toggle('active', btn.id === `${level}Btn`);
        });
        this.resetGame();
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        if (this.isComputerGame) {
            this.statusDisplay.textContent = 'Your Turn (X)';
        } else {
            this.statusDisplay.textContent = `Player ${this.currentPlayer}'s Turn`;
        }
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (this.board[index] || !this.gameActive) return;
        
        if (this.isComputerGame && this.currentPlayer !== this.humanPlayer) return;
        
        this.makeMove(index);
        
        if (this.gameActive && this.isComputerGame) {
            setTimeout(() => {
                this.makeComputerMove();
            }, 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.remove('x', 'o');
        void cell.offsetWidth;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWin()) {
            let message;
            if (this.isComputerGame) {
                message = this.currentPlayer === this.humanPlayer ? 
                    'Congratulations! You Won! 🎉' : 
                    'Bot Wins! Better luck next time! 🤖';
            } else {
                message = `Player ${this.currentPlayer} Wins! 🎉`;
            }
            this.gameActive = false;
            showGameOverPopup(message);
            return;
        }
        
        if (this.checkDraw()) {
            this.gameActive = false;
            showGameOverPopup("It's a Draw! 🤝");
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.isComputerGame) {
            this.statusDisplay.textContent = this.currentPlayer === this.humanPlayer ?
                'Your Turn (X)' : 'Bot Thinking...';
        } else {
            this.statusDisplay.textContent = `Player ${this.currentPlayer}'s Turn`;
        }
    }

    makeComputerMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    findBestMove() {
        if (this.difficulty === 'easy') {
            const availableMoves = this.board
                .map((cell, index) => cell === '' ? index : -1)
                .filter(index => index !== -1);
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        if (this.difficulty === 'medium') {
            if (Math.random() < 0.5) {
                const strategicMove = this.findStrategicMove();
                if (strategicMove !== -1) return strategicMove;
            }
            return this.findRandomMove();
        }

        return this.findStrategicMove();
    }

    findStrategicMove() {
        const winMove = this.findWinningMove(this.computerPlayer);
        if (winMove !== -1) return winMove;

        const blockMove = this.findWinningMove(this.humanPlayer);
        if (blockMove !== -1) return blockMove;

        if (this.board[4] === '') return 4;

        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        return this.findRandomMove();
    }

    findRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : -1)
            .filter(index => index !== -1);
        return availableMoves.length > 0 ? 
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }

    findWinningMove(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (winPatterns.some(pattern => {
                    const [a, b, c] = pattern;
                    return this.board[a] && 
                           this.board[a] === this.board[b] && 
                           this.board[a] === this.board[c];
                })) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return -1;
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
}

function showGameOverPopup(result) {
    const popup = document.getElementById('gameOverPopup');
    const resultMessage = document.getElementById('resultMessage');
    
    // Set the result message based on the game outcome
    resultMessage.textContent = result;
    
    // Show the popup
    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('gameOverPopup');
    popup.style.display = 'none';
    
    // Get the game instance and reset
    window.game.resetGame();
}

function endGame(isWinner) {
    if (isWinner) {
        showGameOverPopup('Congratulations! You won! 🎉');
    } else {
        showGameOverPopup('Game Over! Better luck next time! 😊');
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TicTacToe();
}); 