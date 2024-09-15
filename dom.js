export const dom = {
    createGameContainer() {
        const container = document.createElement('div');
        container.id = 'game-container';
        container.innerHTML = `
            <div id="wrapper"></div>
            <div id="player1">Player 1</div>
            <div id="board-container">
                <div id="winMessage"></div>
                <canvas id="gameCanvas"></canvas>
                <canvas id="boardCanvas"></canvas>
                <button id="playButton">Play again</button>
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
                background-color: #6b6b6b;
                font-family: Arial, sans-serif;
            }
            * {
                user-select:none;
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
            #winMessage {
                position: absolute;
                top: 10vh;
                left: 45vw;
                transform: translate(-50%, -50%);
                font-size: calc(2vw + 2vh);
                font-weight: bold;
                text-align: center;
                padding: calc(1vw + 1vh);
                border-radius: 10px;
                background-color: rgba(255, 255, 255, 0.8);
                z-index: 1000;
                display: none;
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
            
            #playButton {
                position: absolute;
                padding: calc(0.5vw + 0.5vh) calc(1vw + 1vh);   
                font-size: calc(1vw + 1vh);
                bottom:1vh;
                background-color: #ffdd57;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                display:none;
                z-index: 15;
            }
            .wrapper {
                width: 100vw;
                height: 100vh;
                overflow: hidden;
            }
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: #FF5733;
                border-radius: 50%;
                pointer-events: none;
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