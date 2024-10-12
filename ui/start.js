import { createContainer, createInput, createButton, createModal, addStyles } from './uiComponents.js';
import { createRoom, joinRoom, startGame } from './helper.js';

export function startPage() {
    addStyles();

    const container = createContainer();
    document.body.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Welcome to Connect 4';
    container.appendChild(title);

    const playerNameInput = createInput('text', 'Enter your name');
    container.appendChild(playerNameInput);

    const createRoomBtn = createButton('Create Room', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            const roomId = createRoom(playerName);
            displayRoomId(roomId);
            startGame(playerName, roomId);
        }
    });
    createRoomBtn.disabled = true;
    container.appendChild(createRoomBtn);

    const joinRoomBtn = createButton('Join Room', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            showJoinRoomModal(playerName);
        }
    });
    joinRoomBtn.disabled = true;
    container.appendChild(joinRoomBtn);

    const roomIdDisplay = document.createElement('div');
    roomIdDisplay.id = 'roomIdDisplay';
    container.appendChild(roomIdDisplay);

    playerNameInput.addEventListener('input', () => {
        const name = playerNameInput.value.trim();
        createRoomBtn.disabled = !name;
        joinRoomBtn.disabled = !name;
    });

    function displayRoomId(roomId) {
        roomIdDisplay.textContent = `Room ID: ${roomId}`;
        roomIdDisplay.style.display = 'block';
    }

    function showJoinRoomModal(playerName) {
        const modal = createModal('Join Room', (roomId) => {
            if (roomId) {
                joinRoom(playerName, roomId);
                startGame(playerName, roomId);
            }
        });
        document.body.appendChild(modal);
    }
}