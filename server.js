import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow any origin for simplicity
    methods: ['GET', 'POST']
  }
});

// Listen for client connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create or join a room
  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 9);
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    console.log(`${socket.id} created and joined room ${roomId}`);
  });

  // Join an existing room
  socket.on('joinRoom', (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room && room.size === 1) {
      socket.join(roomId);
      socket.emit('roomJoined', roomId);
      io.to(roomId).emit('startGame');
      console.log(`${socket.id} joined room ${roomId}`);
    } else {
      socket.emit('error', 'Room does not exist or is full.');
    }
  });

  // Relay moves between players
  // On receiving a move from a player
socket.on('move', (data) => {
    console.log("Move received on server:", data); // Log the move to check if it's received
    
    // Check if the player is in the room before broadcasting
    const room = io.sockets.adapter.rooms.get(data.room); // Get the room
    if (room) {
        console.log(`Players in room ${data.room}:`, room.size); // Log how many players are in the room
        socket.to(data.room).emit('move', data); // Broadcast the move to the other player
    } else {
        console.log(`Room ${data.room} does not exist or is empty.`);
    }
});


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server on localhost:3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

