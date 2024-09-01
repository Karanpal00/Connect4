import { renderer } from './renderer.js';
import { gameLogic } from './gameLogic.js';
import {confettistart} from './confetti.js';

export const eventHandlers = {
    isTouching: false,
    isPaused: false,  // Flag to indicate if the game is paused

    initialize() {
        
        this.button = document.getElementById("playButton"); // Access the button after DOM setup
        if (!this.button) {
            console.error("Button with ID 'playButton' not found.");
            return;
        }
        this.addEventListeners();
    },

    addEventListeners() {
        const boardCanvas = document.getElementById('boardCanvas');
        boardCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        boardCanvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        boardCanvas.addEventListener('click', this.handleClick.bind(this));
        boardCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        boardCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        boardCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        document.getElementById('resetButton').addEventListener('click', this.handleReset.bind(this));
    },

    handleMouseMove(e) {
        if (!this.isTouching && !renderer.isAnimating && !this.isPaused) {
            renderer.hoverColumn = this.getColumnFromX(e.clientX);
            renderer.drawBoardAndPieces();
        }
    },

    handleMouseLeave() {
        renderer.hoverColumn = -1;
        renderer.drawBoardAndPieces();
    },

    handleTouchMove(e) {
        e.preventDefault();
        if (!renderer.isAnimating && !this.isPaused) {
            const touch = e.touches[0];
            renderer.hoverColumn = this.getColumnFromX(touch.clientX);
            renderer.drawBoardAndPieces();
        }
    },

    handleTouchStart(e) {
        this.isTouching = true;
        const touch = e.touches[0];
        renderer.hoverColumn = this.getColumnFromX(touch.clientX);
        renderer.drawBoardAndPieces();
    },

    handleTouchEnd(e) {
        this.isTouching = false;
        renderer.hoverColumn = -1;
        renderer.drawBoardAndPieces();
        const touch = e.changedTouches[0];
        if (!renderer.isAnimating && !this.isPaused) {
            this.handleInput(touch.clientX);
        }
    },

    handleClick(e) {
        if (!this.isTouching && !renderer.isAnimating && !this.isPaused) {
            this.handleInput(e.clientX);
        }
    },

    handleReset() {
        gameLogic.resetGame();
        renderer.drawBoardAndPieces();
        renderer.clearWinCanvas();
        confettistart.stopConfetti();
        this.button.style.display = 'none'; 
        this.isPaused = false;
        this.enableInput(); 
    },

    async handleInput(clientX) {
        if (renderer.isAnimating || this.isPaused) return;
        const col = this.getColumnFromX(clientX);
        const dropResult = gameLogic.dropPiece(col);
        if (dropResult) {
            await renderer.animatePieceDrop(dropResult.row, dropResult.col, dropResult.player);
            gameLogic.commitDrop(dropResult.row, dropResult.col);
            
            setTimeout(() => {
                if (gameLogic.checkWin(dropResult.row, dropResult.col)) {
                    renderer.displayWin();
                    confettistart.startConfetti();
                    this.showPlayButton();
                } else if (gameLogic.board.flat().every(cell => cell !== null)) {
                    renderer.displayWin();
                    this.showPlayButton();
                } else {
                    gameLogic.switchPlayer();
                    renderer.drawBoardAndPieces();
                }
            }, 150);
        }
    },

    showPlayButton() {
        this.button.style.display = 'block'; // Show the button
        this.button.addEventListener('click', this.handleReset.bind(this), { once: true });
        this.isPaused = true; // Pause the game
        this.disableInput(); // Disable input
    },

    disableInput() {
        const boardCanvas = document.getElementById('boardCanvas');
        boardCanvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        boardCanvas.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
        boardCanvas.removeEventListener('click', this.handleClick.bind(this));
        boardCanvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        boardCanvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        boardCanvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    },

    enableInput() {
        const boardCanvas = document.getElementById('boardCanvas');
        boardCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        boardCanvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        boardCanvas.addEventListener('click', this.handleClick.bind(this));
        boardCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        boardCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        boardCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    },

    getColumnFromX(clientX) {
        const rect = renderer.boardCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        return Math.floor(x / renderer.cellSize);
    }
};
