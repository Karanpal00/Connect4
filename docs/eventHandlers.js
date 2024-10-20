import { gameLogic } from './gameLogic.js';
import { inputQueue } from './inputQueue.js';

export const eventHandlers = {
    initialize() {
        this.addEventListeners();
    },

    addEventListeners() {
        const boardCanvas = document.getElementById('boardCanvas');
        
        boardCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        boardCanvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        boardCanvas.addEventListener('click', this.handleClick.bind(this));
        boardCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        boardCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        boardCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        document.getElementById('playButton').addEventListener('click', this.handlePlayButton.bind(this));
        document.getElementById('resetButton').addEventListener('click', this.handleResetButton.bind(this));
    },

    handleMouseMove(e) {
        inputQueue.enqueue({ type: 'hover', clientX: e.clientX });
    },

    handleMouseLeave() {
        inputQueue.enqueue({ type: 'hover', clientX: null });
    },

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        inputQueue.enqueue({ type: 'hover', clientX: touch.clientX });
    },

    handleTouchStart(e) {
        const touch = e.touches[0];
        inputQueue.enqueue({ type: 'hover', clientX: touch.clientX });
    },

    handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        inputQueue.enqueue({ type: 'click', clientX: touch.clientX });
    },

    handleClick(e) {
        inputQueue.enqueue({ type: 'click', clientX: e.clientX });
    },

    handleResetButton() {
        inputQueue.enqueue({ type: 'reset', clientX: null });
    },
    
    handlePlayButton() {
        inputQueue.enqueue({ type: 'playAgain', clientX: null });
    },

};