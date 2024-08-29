export const dom = {
    createGameContainer() {
        const container = document.createElement('div');
        container.id = 'game-container';
        container.innerHTML = `
            <div id="player1">Player 1</div>
            <div id="board-container">
                <canvas id="gameCanvas"></canvas>
                <canvas id="boardCanvas"></canvas>
            </div>
            <div id="player2">Player 2</div>
            <div id="resetButton"><span>x</span></div>
        `;
        return container;
    },

    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
            }
            body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
            }
            #game-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 100vw;
                height: 100vh;
                box-sizing: border-box;
                padding: 20px;
                position: relative;
            }
            #player1, #player2 {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                font-weight: bold;
                color: white;
                background-color: #333;
                border-radius: 15px;
                margin: 5px 0;
            }
            #resetButton {
                background-color: #ee410d;
                color: white;
                border: none;
                border-radius: 70%;
                width: 40px;
                height: 40px;
                font-size: 30px;
                cursor: pointer;
                position: absolute;
                top: 24px;
                right: 15px;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #board-container {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 1;
                padding: 10px;
                box-sizing: border-box;
            }
            canvas {
                position: absolute;
            }
        `;
        document.head.appendChild(style);
    },
    initializeDOM() {
        document.body.appendChild(this.createGameContainer());
        this.applyStyles();
    }

};