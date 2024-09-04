import { config } from './config.js';
import { gameLogic } from './gameLogic.js';
import Piece from './piece.js';

export const renderer = {
    gameCanvas: null,
    gameCtx: null,
    boardCanvas: null,
    boardCtx: null,
    cellSize: 0,
    hoverColumn: -1,
    isAnimating: false,
    player1: null,
    player2: null,
    emptyhole: null,
    color:null,

    initialize() {
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        this.boardCanvas = document.getElementById('boardCanvas');
        this.winCanvas = document.getElementById('winCanvas');
        this.winCtx = this.winCanvas.getContext('2d');
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
        this.winCanvas.width = size;
        this.winCanvas.height = size*0.6;
        this.cellSize = size / config.cols;
        
        this.player1 = new Piece(this.cellSize,0.6, config.player1Color, this.boardCtx, 0,0,0,0,1, false),
        this.player2 = new Piece(this.cellSize,0.6, config.player2Color, this.boardCtx, 0,0,0,0,1, false),
        this.player1gameCTX = new Piece(this.cellSize,0.6, config.player1Color, this.gameCtx, 0,0,0,0,1, false),
        this.player2gameCTX = new Piece(this.cellSize,0.6, config.player2Color, this.gameCtx, 0,0,0,0,1, false);

        let xOffset = -1;
        let yOffset = 4;
        if (this.cellSize <= 55) {
            xOffset = 0;
            yOffset = 0;
        }
    
    this.emptyhole = new Piece(this.cellSize, 0.8, config.emptyColor, this.gameCtx, xOffset, 0, yOffset, 0, 0.8, true);
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
                this.emptyhole.render(x, y);

                if (player) {
                    player === 1 ? this.player1.render(x,y): this.player2.render(x,y);    
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
            
            this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.cellSize);
            gameLogic.currentPlayer === 1 ? this.player1gameCTX.render(x,this.cellSize/2) : this.player2gameCTX.render(x,this.cellSize/2);
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
    animatePieceDrop(row, col) {
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
    
                if (gameLogic.currentPlayer === 1) {
                    this.player1gameCTX.render(x, y);
                } else {
                    this.player2gameCTX.render(x, y);
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
    

    displayWin() {
        this.color = gameLogic.currentPlayer === 1? "Red" : "Yellow";
        this.winCanvas.style.display = 'block';
        this.winCtx.clearRect(0, 0, winCanvas.width, winCanvas.height);
        this.winCtx.fillStyle = this.color;
        this.winCtx.font = "40px Arial";
        this.winCtx.textAlign = "center";
        this.winCtx.fillText(`${this.color.toUpperCase()} WINS!`, winCanvas.width/2, winCanvas.height/2);

        gsap.fromTo(winCanvas, 
            { opacity: 0, scale: 0.5, rotation: -15 }, 
            { opacity: 1, scale: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
        );
    },
    
    clearWinCanvas () {
        this.winCtx.clearRect(0,0, winCanvas.width, winCanvas.height);
    }
    
      
};
