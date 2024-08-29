import { renderer } from './renderer.js';
import { gameLogic } from './gameLogic.js';

export const eventHandlers = {
    isTouching: false,

    initialize() {
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
        if (!this.isTouching && !renderer.isAnimating) {
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
        if (!renderer.isAnimating) {
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
        const touch = e.changedtouches[0];
        renderer.drawBoardAndPieces();

        if (!renderer.isAnimating) {
            this.handleInput(touch.clientX);
        }
    },

    handleClick(e) {
        if (!this.isTouching && !renderer.isAnimating) {
            this.handleInput(e.clientX);
        }
    },

    handleReset() {
        gameLogic.resetGame();
        renderer.drawBoardAndPieces();
    },

    async handleInput(clientX) {
        if (renderer.isAnimating) return;
        const col = this.getColumnFromX(clientX);
        const dropResult = gameLogic.dropPiece(col);
        if (dropResult) {
            await renderer.animatePieceDrop(dropResult.row, dropResult.col, dropResult.player);
            gameLogic.commitDrop(dropResult.row, dropResult.col);

            if (gameLogic.checkWin(dropResult.row, dropResult.col)) {
                alert(`Player ${gameLogic.currentPlayer} wins!`);
                this.handleReset();
            } else if (gameLogic.board.flat().every(cell => cell !== null)) {
                alert("It's a draw!");
                this.handleReset();
            } else {
                gameLogic.switchPlayer();
                renderer.drawBoardAndPieces();
            }
        }
    },

    getColumnFromX(clientX) {
        const rect = renderer.boardCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        return Math.floor(x / renderer.cellSize);
    }
};
