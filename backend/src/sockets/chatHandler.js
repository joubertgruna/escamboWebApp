const chatService = require('../services/chatService');
const matchRepository = require('../repositories/matchRepository');
const pushService = require('../services/pushService');
const db = require('../config/database');
const logger = require('../utils/logger');

module.exports = (io, socket) => {
  // Join a match chat room
  socket.on('chat:join', async (matchId) => {
    try {
      const isParticipant = await matchRepository.isParticipant(matchId, socket.userId);
      if (!isParticipant) {
        socket.emit('error', { message: 'Sem permissão.' });
        return;
      }
      socket.join(`match:${matchId}`);
      logger.info(`User ${socket.userId} joined chat room match:${matchId}`);
    } catch (err) {
      logger.error(`Error joining chat: ${err.message}`);
      socket.emit('error', { message: 'Erro ao entrar no chat.' });
    }
  });

  // Leave a match chat room
  socket.on('chat:leave', (matchId) => {
    socket.leave(`match:${matchId}`);
    logger.info(`User ${socket.userId} left chat room match:${matchId}`);
  });

  // Send a message
  socket.on('chat:message', async ({ matchId, content }) => {
    try {
      logger.info(`chat:message received from user ${socket.userId} for match ${matchId}`, { contentPreview: content?.slice(0,50) });
      const message = await chatService.sendMessage(matchId, socket.userId, content);

      logger.info(`chat:message persisted id=${message.id} match=${message.match_id} sender=${message.sender_id}`);

      // Broadcast to all users in the match room
      logger.info(`Emitting chat:message to room match:${matchId}`);
      io.to(`match:${matchId}`).emit('chat:message', {
        id: message.id,
        match_id: message.match_id,
        sender_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
      });

      logger.info(`Also notifying other user for match ${matchId}`);

      // Also notify the other user if they're not in the room
      const match = await matchRepository.findById(matchId);
      const otherUserId = match.user_1_id === socket.userId
        ? match.user_2_id
        : match.user_1_id;

      io.to(`user:${otherUserId}`).emit('chat:notification', {
        matchId,
        message: content,
        senderId: socket.userId,
      });

      logger.info(`Emitted chat:notification to user:${otherUserId}`);

      // Enviar Push Notification para o outro usuário
      try {
        const sender = await db('users').where({ id: socket.userId }).first();
        await pushService.sendChatNotification(otherUserId, sender, content, matchId);
      } catch (pushErr) {
        logger.warn(`Push notification falhou: ${pushErr.message}`);
      }
    } catch (err) {
      logger.error(`Error sending message: ${err.message}`);
      socket.emit('error', { message: err.message });
    }
  });

  // Typing indicator
  socket.on('chat:typing', ({ matchId }) => {
    socket.to(`match:${matchId}`).emit('chat:typing', {
      userId: socket.userId,
    });
  });

  socket.on('chat:stop-typing', ({ matchId }) => {
    socket.to(`match:${matchId}`).emit('chat:stop-typing', {
      userId: socket.userId,
    });
  });
};
