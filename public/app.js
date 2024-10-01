import {inputQueue} from './inputQueue.js';
import { initializeGame } from './main.js';
import { io } from './socket.io';

    const socket = io();  // Replace with your actual Ngrok URL

        let roomId;

        // Create a room (for the first player)
        function createRoom() {
            socket.emit('createRoom');
        }

        // Join a room (for the second player)
        function joinRoom() {
            roomId = prompt("Enter the Room ID to join:");
            socket.emit('joinRoom', roomId);
        }

        // Listen for room creation confirmation
        socket.on('roomCreated', (id) => {
            roomId = id;
            console.log("Room created with ID:", roomId);
            alert(`Room created! Share this ID with your opponent: ${roomId}`);
        });

        // Listen for successful room joining
        socket.on('roomJoined', (roomId) => {
            console.log(`Joined room: ${roomId}`);
        });

        // Start the game when both players are in the room
        socket.on('startGame', () => {
            console.log("Both players are in the room. Game starts now!");
            
            initializeGame();
            // Start the game logic here
        });

        // Send move to the server
        function sendMove(move) {
            socket.emit('move', { ...move, room: roomId });
        }

        // Listen for moves from the opponent
        socket.on('move', (data)=> {
            console.log("move received on app: ", data);
            inputQueue.enqueue(data);
        });
        
        function processQueue() {
            while (inputQueue.clientQueue.length > 0) {
                const input = inputQueue.clientQueue.shift();
                console.log(input.type);
                if (input.type === 'click') {
                    console.log('Emitting move:', input); 
                    socket.emit('move', input);
                }
            }
        }
        
        
        setInterval(processQueue, 100);
        // Bind buttons to functions (for demonstration)
        document.querySelector('#createRoomButton').addEventListener('click', createRoom);
        document.querySelector('#joinRoomButton').addEventListener('click', joinRoom);




