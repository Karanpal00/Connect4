import {inputQueue} from './inputQueue.js';
import playAgain from './playAgainModal.js';

const socket = io();

let roomId = null;
let playerId = null;
let playerRole = null;
let lastMove = null;
let flag = false;

function createRoom() {
    if (roomId === null) {
        socket.emit('createRoom');
        console.log('Requesting to create a room...');
    } else {
        console.log("Already in a room");
    }
    
}

function joinRoom() {
    if (!roomId) {
        const roomIdToJoin = prompt("Enter the Room ID to join:");
        if (roomIdToJoin) {
            console.log(`Requesting to join room: ${roomIdToJoin}`);
            socket.emit('joinRoom', roomIdToJoin);
        }
    } else {
        console.log("Already in a room");
    }   
}

function sendMove(move) {
    if (roomId && playerId) {
        socket.emit('move', { ...move, room: roomId, player: playerId });
    } else {
        console.error('Cannot send move: Room or Player ID is missing');
    }
}
function reset() {
    roomId = null;
    playerId = null;
    playerRole = null;
    lastMove = null;
    flag = false;
    inputQueue.handleInput({type:'reset'});
}

socket.on('connect', () => {
    console.log('Connected to server with socket ID:', socket.id);
});

socket.on('roomCreated', (data) => {
    console.log('Received roomCreated event:', data);
    if (data && data.roomId && data.playerId) {
        roomId = data.roomId;
        playerId = data.playerId;
        playerRole = 'player1';
        console.log(`Room created with ID: ${roomId}`);
        console.log(`You are Player 1 with ID: ${playerId}`);
        alert(`Room created! Share this ID with your opponent: ${roomId}`);
    } else {
        console.error('Invalid data received for roomCreated event:', data);
    }
});

socket.on('roomJoined', (data) => {
    roomId = data.roomId;
    playerId = data.playerId;
    playerRole = 'player2';
    console.log(`Joined room: ${roomId}`);
    console.log(`You are Player 2 with ID: ${playerId}`);
});

socket.on('startGame', (data) => {
    console.log('Received startGame data:', data);
    if (data && data.player1 && data.player2) {
        flag = false;
        inputQueue.handleInput({type: 'reset', clientX : null});
        const player1 = document.getElementById('player1');
        player1.style.backgroundColor = 'green';
        console.log(`Game started. Player 1: ${data.player1}, Player 2: ${data.player2}`);
        if (playerId === data.player1) {
            console.log('You are Player 1');
        } else if (playerId === data.player2) {
            console.log('You are Player 2');
        }
        lastMove = data.player2;
    } else {
        console.error('Error: Invalid data received from startGame event.');
    }
});

async function askToPlay (playAgainObj) {
    const again = await playAgainObj.show();
    if (again) {
        if (roomId) {
            console.log('Emitting startAgain with roomId:', roomId);
            socket.emit('startAgain', roomId);

        } else {
            console.log('KNUL');
        }
        
    } else {
        socket.emit('playerDeclined', {roomId: roomId, player : playerId});
        reset();
    }
}

socket.on('declineMessage', (data)=> {
    if (playerId) {
        alert('Player Declined exiting....');
        reset();
    }
});
socket.on('move', (data) => {
    console.log('Move received:', data);
    if (data.type === 'playAgain' && !flag) {
        const playAgainObj = new playAgain();
        askToPlay(playAgainObj);
    }
    if (lastMove !== data.player) {
        inputQueue.handleInput(data);
        lastMove = data.player;
    } else {
        console.log('Ignoring move: Not this player\'s turn');
    }
});

socket.on('playerDisconnected', (disconnectedPlayerId) => {
    console.log(`Player ${disconnectedPlayerId} has disconnected`);
});

socket.on('roomFull', () => {
    console.log('The room is full. Cannot join.');
    alert('The room is full. Please try another room or create a new one.');
});

socket.on('roomNotFound', () => {
    console.log('Room not found. Please check the room ID.');
    alert('Room not found. Please check the room ID and try again.');
});

function processQueue() {
    while (inputQueue.clientQueue.length > 0) {
        const input = inputQueue.clientQueue.shift();
        if(input.type === 'hover' && lastMove !== playerId) {
            inputQueue.handleInput(input);
        } else if (input.type === 'click' && lastMove !== playerId) {
            inputQueue.handleInput(input);
            sendMove(input);
            lastMove = playerId;
        } else if (input.type === 'playAgain' && !flag) {
            sendMove(input);
            flag = true;
        }
    }
}

setInterval(processQueue, 100);

document.addEventListener('DOMContentLoaded', () => {
    const createRoomButton = document.querySelector('#createRoomButton');
    const joinRoomButton = document.querySelector('#joinRoomButton');

    if (createRoomButton) {
        createRoomButton.addEventListener('click', createRoom);
    } else {
        console.error('#createRoomButton not found in the document');
    }

    if (joinRoomButton) {
        joinRoomButton.addEventListener('click', joinRoom);
    } else {
        console.error('#joinRoomButton not found in the document');
    }
});