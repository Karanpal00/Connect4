import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('docs'));
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36);
    rooms.set(roomId, { players: [socket.id], moves: [] });
    socket.join(roomId);
    console.log(`Room created: ${roomId} by player: ${socket.id}`);
    socket.emit('roomCreated', { roomId: roomId, playerId: socket.id });
  });

  socket.on('joinRoom', (roomId) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      if (room.players.length < 2) {
        room.players.push(socket.id);
        socket.join(roomId);
        socket.emit('roomJoined', { roomId, playerId: socket.id });

        if (room.players.length === 2) {
          io.to(roomId).emit('startGame', { 
            player1: room.players[0], 
            player2: room.players[1] 
          });
        }
      } else {
        socket.emit('roomFull');
      }
    } else {
      socket.emit('roomNotFound');
    }
  });

  socket.on('startAgain', (data) => {
    console.log('Received startAgain event with data:', data);
    if (rooms.has(data)) {
      const room = rooms.get(data);
      io.to(data).emit('startGame', {
        player1: room.players[0],
        player2: room.players[1]
      })
    } else {
      console.log("Not Found");
    }
  });

  socket.on('playerDeclined', (data)=> {
    rooms.delete(roomId);
    io.to(data.roomId).emit('declineMessage', data.player);
  })


  socket.on('move', (data) => {
    if (rooms.has(data.room)) {
      const room = rooms.get(data.room);
      room.moves.push(data);
      io.to(data.room).emit('move', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    rooms.forEach((room, roomId) => {
      const index = room.players.indexOf(socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('playerDisconnected', socket.id);
        }
      }
    });
  });
});

server.listen(5500, () => {
    console.log('Server running at http://localhost:5500');
});