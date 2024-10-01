import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create or join a room
  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 9);
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
    console.log(`${socket.id} created and joined room ${roomId}`);
  });

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


socket.on('move', (data) => {
    console.log("Move received on server:", data); 
    
    
    const room = io.sockets.adapter.rooms.get(data.room); 
    if (room) {
        console.log(`Players in room ${data.room}:`, room.size);
        socket.to(data.room).emit('move', data); 
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

