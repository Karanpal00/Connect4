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
    })()
};