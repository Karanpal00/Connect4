export const config = {
    rows: 7,
    cols: 7,
    player1Color: "#e53935",
    player2Color: "#fdd835",
    boardColor: 'blue',
    emptyColor: '#cfd8dc',
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