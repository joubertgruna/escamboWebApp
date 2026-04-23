const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const socketConfig = require('../config/socket');
const chatHandler = require('./chatHandler');
const logger = require('../utils/logger');

let io;

// Map to track number of active sockets per user
const userSocketCount = new Map();
// Map to store pending offline timers per user
const userOfflineTimers = new Map();

const initSocket = (server) => {
  io = new Server(server, socketConfig);

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      logger.warn('Socket auth failed: token not provided (handshake).');
      return next(new Error('Token não fornecido.'));
    }
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      return next();
    } catch (err) {
      logger.warn('Socket auth failed: invalid token.', { error: err.message });
      return next(new Error('Token inválido.'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: user ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);
    
    // Send list of currently online users to the newly connected client
    const onlineUserIds = Array.from(userSocketCount.keys());
    socket.emit('onlineUsers', onlineUserIds);
    logger.info(`Sent online users list to user ${socket.userId}: [${onlineUserIds.join(', ')}]`);
    
    // Update socket count for this user
    try {
      // If there is a pending offline timer, cancel it because a new socket connected
      const pendingTimer = userOfflineTimers.get(socket.userId);
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        userOfflineTimers.delete(socket.userId);
        logger.info(`Cancelled pending offline timer for user ${socket.userId}`);
      }

      const prev = userSocketCount.get(socket.userId) || 0;
      const next = prev + 1;
      userSocketCount.set(socket.userId, next);
      logger.info(`User ${socket.userId} socket count: ${prev} -> ${next}`);

      // Emit userOnline only when transitioning 0 -> 1
      if (prev === 0) {
        io.emit('userOnline', socket.userId);
        logger.info(`Emitted userOnline for user ${socket.userId}`);
      }
    } catch (err) {
      logger.warn(`Failed updating user socket count: ${err.message}`);
    }

    // Chat events
    chatHandler(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: user ${socket.userId} reason=${reason}`);
      // Decrement socket count and schedule userOffline when reaching 0 (debounced)
      try {
        const prev = userSocketCount.get(socket.userId) || 1;
        const next = prev - 1;
        if (next <= 0) {
          // remove count immediately
          userSocketCount.delete(socket.userId);
          logger.info(`User ${socket.userId} socket count: ${prev} -> 0 (scheduling offline)`);

          // Schedule offline emit after a short debounce (3s)
          const timer = setTimeout(() => {
            // Only emit offline if there is still no active socket for this user
            if (!userSocketCount.has(socket.userId)) {
              try {
                io.emit('userOffline', socket.userId);
                logger.info(`Emitted userOffline for user ${socket.userId}`);
              } catch (emitErr) {
                logger.warn(`Failed to emit userOffline: ${emitErr.message}`);
              }
            } else {
              logger.info(`User ${socket.userId} reconnected before offline timeout; skipping offline emit`);
            }
            userOfflineTimers.delete(socket.userId);
          }, 3000);

          userOfflineTimers.set(socket.userId, timer);
        } else {
          userSocketCount.set(socket.userId, next);
          logger.info(`User ${socket.userId} socket count: ${prev} -> ${next}`);
        }
      } catch (err) {
        logger.warn(`Failed updating user socket count on disconnect: ${err.message}`);
      }
    });
  });

  logger.info('Socket.io initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized.');
  }
  return io;
};

module.exports = { initSocket, getIO };
