import { Server } from 'socket.io';
import env from '../config/env.js';

/**
 * Socket.io setup (scaffold for Phase 1, full implementation in Phase 4)
 * Provides basic connection handling and notification broadcasting
 */
export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Track connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      connectedUsers.set(userId, socket.id);
      console.log(`   👤 User ${userId} joined`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  // Expose broadcast function
  io.sendNotification = (userId, notification) => {
    io.to(`user:${userId}`).emit('notification', notification);
  };

  return io;
}
