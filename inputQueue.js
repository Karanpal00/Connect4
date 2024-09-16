import { gameLogic } from './gameLogic.js';
import { renderer } from './renderer.js';

export const inputQueue = {
    queue: [],
    isProcessing: false,

    enqueue(input) {
        if (input.type === 'click' && (this.isProcessing || this.queue.some(item => item.type === 'click'))) {
            return;
        }
        this.queue.push(input);
        this.processQueue();
    },

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const input = this.queue.shift();
            await this.handleInput(input);            
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
                    const col = renderer.getColumnFromX(input.clientX);
                    renderer.hoverColumn = -1;
                    if (col >= 0 && col < 7) {
                        await gameLogic.makeMove(col);
                    }
                        
                }
                break;
            case 'reset':
                gameLogic.resetGame();
                renderer.resetDisplay();
                break;
        }
    }
};