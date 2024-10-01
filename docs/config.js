export const config = {
    rows: 7,
    cols: 7,
    player1Color: "#feed19",
    player2Color: "#f5503a",
    boardColor: '#4b63c5',
    emptyColor: '#6b6b6b',
    endColor: "#eff1fd",
    animationSpeed: 7,
    bounceSound : (() => {
        const sound = new Audio('./bounce.wav');
        sound.onerror = (e) => {
            console.error('Error loading bounce sound:', e);
        };
        return sound;
    })(),
    gameOverSound: (()=> {
        const sound = new Audio ('./mixkit-game-level-completed-2059.wav');
        sound.onerror = (e) => {
            cobsole.error('Error loading gameover sound:', e);
        }

        return sound;
    })()
};