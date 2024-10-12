export function createRoom(playerName) {
    // This function would typically involve server communication
    // For now, we'll just generate a random room ID
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function joinRoom(playerName, roomId) {
    // This function would typically involve server communication
    // For now, we'll just log the action
    console.log(`${playerName} is joining room ${roomId}`);
}

export function startGame(playerName, roomId) {
    // This function would typically initialize the game
    // For now, we'll just update the UI to show the game has started
    const container = document.querySelector('.container');
    container.innerHTML = `
        <h1>Game Started!</h1>
        <div class="game-info">
            <p><strong>Player:</strong> ${playerName}</p>
            <p><strong>Room ID:</strong> ${roomId}</p>
        </div>
    `;
}