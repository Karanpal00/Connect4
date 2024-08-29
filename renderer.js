import { config } from './config.js';
import { pieceCreator } from './pieceCreator.js';
import { holeCreator } from './holeCreator.js';
import { gameLogic } from './gameLogic.js';

export const renderer = {
    gameCanvas: null,
    gameCtx: null,
    boardCanvas: null,
    boardCtx: null,
    cellSize: 0,
    hoverColumn: -1,
    isAnimating: false,


    initialize() {
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        this.boardCanvas = document.getElementById('boardCanvas');
        this.boardCtx = this.boardCanvas.getContext('2d');
        this.resizeCanvas();
    },

    resizeCanvas() {
        const boardContainer = document.getElementById('board-container');
        const containerWidth = boardContainer.clientWidth;
        const containerHeight = boardContainer.clientHeight;
        const size = Math.min(containerWidth, containerHeight * 0.8);
        
        this.gameCanvas.width = this.boardCanvas.width = size;
        this.gameCanvas.height = this.boardCanvas.height = size;
        this.cellSize = size / config.cols;
        
        this.drawBoardAndPieces();
    },

    drawBoardAndPieces() {
        // Draw board 
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.boardCtx.fillStyle = config.boardColor;
        this.boardCtx.fillRect(0, this.boardCanvas.height/config.cols, this.boardCanvas.width, this.boardCanvas.height);

        this.boardCtx.globalCompositeOperation = 'destination-out';
        for (let row = 1; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = col * this.cellSize + this.cellSize / 2;
                const y = row * this.cellSize + this.cellSize / 2;
                this.boardCtx.beginPath();
                this.boardCtx.arc(x, y, this.cellSize * 0.4, 0, 2 * Math.PI);
                this.boardCtx.fill();
            }
        }
        this.boardCtx.globalCompositeOperation = 'source-over';

        // Draw pieces and background
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        for (let row = 1; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = col * this.cellSize + this.cellSize / 2;
                const y = row * this.cellSize + this.cellSize / 2;
                const player = gameLogic.board[row][col];
                holeCreator.createPiece(this.gameCtx, x, y, this.cellSize * 0.4);

                if (player) {
                    const color = player === 1 ? config.player1Color : config.player2Color;
                    pieceCreator.createPiece(this.boardCtx, x, y, this.cellSize * 0.4, color);
                }
            }
        }

        if (this.hoverColumn !== -1 && !this.isAnimating) {
            this.drawHoverEffect();
        }
    },

    drawHoverEffect() {
        if (this.hoverColumn !== -1) {
            // Draw gray strip
            this.gameCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
            this.gameCtx.fillRect(
                this.hoverColumn * this.cellSize,
                0,
                this.cellSize,
                this.boardCanvas.height
            );

            // Draw hover piece
            const x = this.hoverColumn * this.cellSize + this.cellSize / 2;
            const color = gameLogic.currentPlayer === 1 ? config.player1Color : config.player2Color;
            this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.cellSize);
            pieceCreator.createPiece(this.gameCtx, x, this.cellSize / 2, this.cellSize * 0.35, color);
        }
    },

    updateHoverColumn(clientX) {
        if (this.isAnimating) return;

        const rect = this.boardCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        if (x >= 0 && x < this.boardCanvas.width) {
            const newHoverColumn = Math.floor(x / this.cellSize);
            if (this.hoverColumn !== newHoverColumn) {
                this.hoverColumn = newHoverColumn;
                this.drawBoardAndPieces();
            }
        } else if (this.hoverColumn !== -1) {
            this.hoverColumn = -1;
            this.drawBoardAndPieces();
        }
    },


countStackedPieces(col) {
    let stackedPieces = 0;
    for (let row = 0; row < config.rows; row++) {
        if (gameLogic.board[row][col] !== null) {
            stackedPieces++;
        }
    }
    return stackedPieces;
},

animatePieceDrop(row, col, player) {
    return new Promise((resolve) => {
        this.isAnimating = true;
        const startY = -this.cellSize / 2;
        const endY = (row + 0.5) * this.cellSize;
        const x = (col + 0.5) * this.cellSize;
        const color = player === 1 ? config.player1Color : config.player2Color;

        const duration = 1000;
        const startTime = Date.now();

        // Ease-out bounce function
        const easeOutBounce = (t) => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        };

        const animate = () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const easedProgress = easeOutBounce(progress);
            const y = startY + (endY - startY) * easedProgress;

            this.drawBoardAndPieces();
            pieceCreator.createPiece(this.gameCtx, x, y, this.cellSize * 0.4, color);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                resolve();
            }
        };

        animate();
    });
}

      
};