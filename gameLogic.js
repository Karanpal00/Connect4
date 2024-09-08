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
        for (let row = config.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) return row;
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
            } else if (this.board.flat().every(cell => cell !== null)) {
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

    

    checkWin(row, col, player) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        
        for (const [dx, dy] of directions) {
            let count = 1;
            const cells = [[row, col]];

            for (let i = -3; i <= 3; i++) {
                if (i === 0) continue;
                const r = row + i * dx, c = col + i * dy;
                if (r < 0 || r >= config.rows || c < 0 || c >= config.cols || this.board[r][c] !== player) continue;
                count++;
                cells.push([r, c]);
                if (count === 4) {
                    this.winningCells = cells;
                    return true;
                }
            }
        }
        return false;
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