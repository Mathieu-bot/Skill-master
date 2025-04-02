// /home/tafita/RealHack/backend/src/socket.js
const { Server } = require('socket.io');

let io;

// Initialiser Socket.IO avec le serveur HTTP
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);

    // Authentification du socket
    socket.on('authenticate', (token) => {
      if (token && token.userId) {
        console.log(`Socket ${socket.id} authentifié pour l'utilisateur ${token.userId}`);
        socket.join(token.userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket déconnecté:', socket.id);
    });
  });

  return io;
};

// Récupérer l'instance de Socket.IO
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO n\'a pas été initialisé');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
