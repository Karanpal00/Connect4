import { gameLogic } from './gameLogic.js';
import { renderer } from './renderer.js';

export const inputQueue = {
    clientQueue:[],
    queue: [],
    isProcessing: false,
    row : null,
    modeFlag : true,

    enqueue(input) {
        if (input.type === 'click' && (this.isProcessing || this.queue.some(item => item.type === 'click'))) {
            return;
        }
        if (input.type === 'click') {
            input.clientX = renderer.getColumnFromX(input.clientX);
            this.row = gameLogic.getDropLocation(input.clientX);
        }
        if ((input.clientX < 0 || input.clientX >= 7 || this.row === -1) && input.type === 'click') {
            return;
        }        
    
        if (this.modeflag) {
            this.queue.push(input);
            this.processQueue();
        } else {
            this.clientQueue.push(input);
        }
        
    },

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const input = this.queue.shift();
            await this.handleInput(input); 
            
            if (input.type === 'click') {
                break;
            }           
        }

        this.isProcessing = false;
    },

    async handleInput(input) {
        switch (input.type) {
            case 'hover':
                renderer.updateHoverColumn(input.clientX);
                break;
            case 'click':
                if (!renderer.isAnimating && !gameLogic.isPaused && !gameLogic.isProcessingMove) {
                    renderer.hoverColumn = -1;
                    await gameLogic.makeMove(input.clientX);
                }
                break;
            case 'reset':
                gameLogic.resetGame();
                renderer.resetDisplay();
                break;
        }
    }
};