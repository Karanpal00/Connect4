import { config } from './config.js';
import { gameLogic } from './gameLogic.js';
import Piece from './piece.js';

export const renderer = {
    gameCanvas: null,
    gameCtx: null,
    boardCanvas: null,
    boardCtx: null,
    winMessageElement: null,
    cellSize: 0,
    hoverColumn: -1,
    isAnimating: false,
    player1: null,
    player2: null,
    emptyhole: null,
    player1gameCTX: null,
    player2gameCTX: null,
    gameOver : null,

    initialize() {
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        this.boardCanvas = document.getElementById('boardCanvas');
        this.boardCtx = this.boardCanvas.getContext('2d');
        this.winMessageElement = document.getElementById('winMessage');
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

        const boardPiece = 0.32;
        const midPiece = 0.35;

        this.player1 = new Piece(0.4, config.player1Color, this.gameCtx, boardPiece,1, 1);
        this.player2 = new Piece(0.4, config.player2Color, this.gameCtx, boardPiece,1, 1);

        this.player1Mid = new Piece(0.4, config.player1Color, this.gameCtx, midPiece,1, 1);
        this.player2Mid = new Piece(0.4, config.player2Color, this.gameCtx, midPiece,1, 1);

        this.hoverPlayer1 = new Piece(0.4, config.player1Color, this.gameCtx, boardPiece, 0.4, 0.3);
        this.hoverPlayer2 = new Piece(0.4, config.player2Color, this.gameCtx, boardPiece, 0.4, 0.3);

    
        this.emptyhole = new Piece(0.8, config.emptyColor, this.gameCtx,0.3, 1, 0.8, true);
        this.drawBoardAndPieces();
    },

    drawBoardAndPieces() {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.boardCtx.fillStyle = config.boardColor;
        this.boardCtx.fillRect(0, this.boardCanvas.height/config.cols, this.boardCanvas.width, this.boardCanvas.height);

        this.boardCtx.globalCompositeOperation = 'destination-out';
        for (let row = 1; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = col * this.cellSize + this.cellSize / 2;
                const y = row * this.cellSize + this.cellSize / 2;

                this.boardCtx.beginPath();
                this.boardCtx.arc(x, y, this.cellSize * 0.3, 0, 2 * Math.PI);
                this.boardCtx.fill();
            }
        }
        this.boardCtx.globalCompositeOperation = 'source-over';

        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        const winningCells = gameLogic.getWinningCells();

        for (let row = 1; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = col * this.cellSize + this.cellSize / 2;
                const y = row * this.cellSize + this.cellSize / 2;
                const player = gameLogic.board[row][col];
                this.emptyhole.render(x, y);

                if (player !== null) {
                    const isWinningCell = winningCells.some(cell => cell[0] === row && cell[1] === col);
                    if ((isWinningCell || !this.gameOver )){
                        player === 1 ? this.player1.render(x, y) : this.player2.render(x, y);
                    } else {
                        const grayPiece = new Piece(0.6, config.endColor, this.gameCtx,0.3,1, 1);
                        grayPiece.render(x, y);
                    }
                }
            }
        }

        if (!this.isAnimating && !this.gameOver) {
            const x = 3*this.cellSize+this.cellSize/2;

            gameLogic.currentPlayer === 1 
                    ? this.player1Mid.render(x, this.cellSize/2) 
                    : this.player2Mid.render(x, this.cellSize/2);
        }
        
        if ((this.hoverColumn >= 0 && this.hoverColumn < 7) && !this.isAnimating && !this.gameOver) {
            this.drawHoverEffect();
        }
    },

    drawHoverEffect() {
        
        if (this.hoverColumn !== -1) {
            const row = gameLogic.getDropLocation(this.hoverColumn);
           // if (row !== -1) {
                this.gameCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
                this.gameCtx.fillRect(
                    this.hoverColumn * this.cellSize,
                    0,
                    this.cellSize,
                    this.boardCanvas.height - (this.cellSize*(6-row))
                );

            
            const x = this.hoverColumn * this.cellSize + this.cellSize / 2;
            const y = row* this.cellSize + this.cellSize / 2;
            let ProjY = this.cellSize;
            if (row === -1) {
                ProjY = this.cellSize/2;
            } 

            this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.cellSize);
            gameLogic.currentPlayer === 1 
                ? this.player1.render(x, ProjY) 
                : this.player2.render(x, ProjY);

            gameLogic.currentPlayer === 1 
                ? this.hoverPlayer1.render(x, y) 
                : this.hoverPlayer2.render(x, y);
            }  
        //}
    },

    updateHoverColumn(clientX) {
        if (this.isAnimating || this.gameOver) {
            this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.cellSize);
            return;
        }

        const newHoverColumn = clientX === null ? -1 : this.getColumnFromX(clientX);
        if (this.hoverColumn !== newHoverColumn) {
            this.hoverColumn = newHoverColumn;
            this.drawBoardAndPieces();
        }
    },

    getColumnFromX(clientX) {
        const rect = this.boardCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        return Math.floor(x / this.cellSize);
    },    

    animatePieceDrop(row, col, player) {
        return new Promise((resolve) => {
            this.isAnimating = true;
            const startY = this.cellSize / 2;
            const endY = (row + 0.5) * this.cellSize;
            const x = (col + 0.5) * this.cellSize;
    
            const duration = 1000;
            const startTime = Date.now();
            let hasPlayedBounceSound = false;
    
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
    
            const bounceSound = config.bounceSound;
            bounceSound.load();
    
            const animate = () => {
                const currentTime = Date.now();
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
    
                const easedProgress = easeOutBounce(progress);
                const y = startY + (endY - startY) * easedProgress;
    
                this.drawBoardAndPieces();
    
                if (player === 1) {
                    this.player1.render(x, y);
                } else {
                    this.player2.render(x, y);
                }
    
                if (progress >= 0.1 && !hasPlayedBounceSound) {
                    bounceSound.play().catch(error => console.error('Error playing sound:', error));
                    hasPlayedBounceSound = true;
                }
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    resolve();
                }
            };
    
            animate();
        });
    },

    displayWin(player) {
        const color = player === 1 ? "Yellow" : "Red";
        this.displayEndGame(`${color.toUpperCase()} WINS!`, player);
    },

    displayDraw() {
        this.displayEndGame("IT'S A DRAW!");
    },

    displayEndGame(message, winningPlayer = null) {
        this.winMessageElement.textContent = message;
        this.winMessageElement.style.color = "black";
        this.winMessageElement.style.display = 'block';
        
        const gameover = config.gameOverSound;
        gameover.play();

        gsap.fromTo(this.winMessageElement,
            { opacity: 0, scale: 0.5, rotation: -15 },
            { opacity: 1, scale: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
        );

        this.gameOver = true;

        if (winningPlayer !== null) {
            this.drawBoardAndPieces();
        }
    },

    resetDisplay() {
        this.winMessageElement.style.display = 'none';
        this.gameOver = false;
        this.drawBoardAndPieces();
    }
};