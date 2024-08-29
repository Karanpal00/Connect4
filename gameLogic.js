import { config } from './config.js';

export const gameLogic = {
    board: [],
    currentPlayer: 1,

    initializeBoard() {
        this.board = Array.from({ length: config.rows }, () => Array(config.cols).fill(null));
        this.currentPlayer = 1;
    },

    getDropLocation(col) {
        for (let row = config.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) return row;
        }
        return -1;
    },

    dropPiece(col) {
        const row = this.getDropLocation(col);
        if (row !== -1) {
            return { row, col, player: this.currentPlayer };
        }
        return null;
    },

    commitDrop(row, col) {
        this.board[row][col] = this.currentPlayer;
    },

    checkWin(row, col) {
        const directions = [
            { x: 0, y: 1 },   // vertical
            { x: 1, y: 0 },   // horizontal
            { x: 1, y: 1 },   // diagonal /
            { x: 1, y: -1 }   // diagonal \
        ];

        for (let { x, y } of directions) {
            let count = 1;

            for (let i = 1; i < 4; i++) {
                const r = row + i * x;
                const c = col + i * y;
                if (r < 0 || r >= config.rows || c < 0 || c >= config.cols || this.board[r][c] !== this.currentPlayer) break;
                count++;
            }

            for (let i = 1; i < 4; i++) {
                const r = row - i * x;
                const c = col - i * y;
                if (r < 0 || r >= config.rows || c < 0 || c >= config.cols || this.board[r][c] !== this.currentPlayer) break;
                count++;
            }

            if (count >= 4) return true;
        }

        return false;
    },

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    },

    resetGame() {
        this.initializeBoard();
    }
};