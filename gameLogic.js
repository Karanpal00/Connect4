import { config } from './config.js';
import { renderer } from './renderer.js';
import { confettistart } from './confetti.js';

export const gameLogic = {
    board: [],
    currentPlayer: 1,
    isPaused: false,
    isProcessingMove: false,
    winningCells: [],

    initializeBoard() {
        this.board = Array.from({ length: config.rows }, () => Array(config.cols).fill(null));
        this.currentPlayer = 1;
        this.isPaused = false;
        this.isProcessingMove = false;
        this.hidePlayButton();
    },

    getDropLocation(col) {
        if (col < 7 && col >= 0) {
            for (let row = config.rows - 1; row > 0; row--) {
                if (!this.board[row][col]) return row;
            }
        }
        return -1;
    },

    async makeMove(col) {
        if (this.isPaused || this.isProcessingMove) return;

        this.isProcessingMove = true;

        const row = this.getDropLocation(col);
        if (row !== -1) {
            const player = this.currentPlayer;
            await renderer.animatePieceDrop(row, col, player);
            this.board[row][col] = player;

            if (this.checkWin(row, col, player)) {
                renderer.displayWin(player);
                confettistart.startConfetti();
                this.showPlayButton();
                this.isPaused = true;
            } else if (this.checkDraw()) {
                renderer.displayDraw();
                this.showPlayButton();
                this.isPaused = true;
            } else {
                this.switchPlayer();
                renderer.drawBoardAndPieces();
            }
        }
        this.isProcessingMove = false;
    },

    showPlayButton() {
        const button = document.getElementById("playButton");
        button.style.display = 'block';
    },

    hidePlayButton() {
        const button = document.getElementById("playButton");
        button.style.display = 'none';
    },
    
    checkDraw() {
        for (let i = config.rows-1; i > 0;--i) {
            for (let j = config.cols-1; j >= 0; --j) {
                if (this.board[i][j] === null) { 
                    return false;
                }
                
            } 
        }
        return true;
    },
    

    checkWin(row, col, player) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        
        for (const [dx, dy] of directions) {
            let count = 1;
            const cells = [[row, col]];
    
            for (let i = 1; i <= 3; i++) {
                const r = row + i * dx, c = col + i * dy;
                if (this.isValidCell(r, c) && this.board[r][c] === player) {
                    count++;
                    cells.push([r, c]);
                } else {
                    break;
                }
            }
    
            for (let i = 1; i <= 3; i++) {
                const r = row - i * dx, c = col - i * dy;
                if (this.isValidCell(r, c) && this.board[r][c] === player) {
                    count++;
                    if (cells.length < 4) {
                        cells.push([r, c]);
                    }
                } else {
                    break;
                }
            }
    
            if (count >= 4) {
                this.winningCells = cells;
                return true;
            }
        }
        return false;
    },
    
    isValidCell(row, col) {
        return row >= 0 && row < config.rows && col >= 0 && col < config.cols;
    },

    getWinningCells() {
        return this.winningCells;
    },

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    },

    resetGame() {
        this.initializeBoard();
        renderer.resetDisplay();
        renderer.drawBoardAndPieces();
        confettistart.stopConfetti();
    }
};