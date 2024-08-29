import { dom } from './dom.js';
import { gameLogic } from './gameLogic.js';
import { renderer } from './renderer.js';
import { eventHandlers } from './eventHandlers.js';

export function initializeGame() {
    if (!document.getElementById('game-container')) {
        dom.initializeDOM();
    }
    gameLogic.initializeBoard();
    renderer.initialize();
    eventHandlers.initialize();
}

window.addEventListener('load', initializeGame);
window.addEventListener('resize', renderer.resizeCanvas.bind(renderer));