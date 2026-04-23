const chatService = require('../services/chatService');
const pushService = require('../services/pushService');
const matchRepository = require('../repositories/matchRepository');
const db = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler, parsePagination } = require('../utils/helpers');
const { getIO } = require('../sockets');

const getMessages = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const result = await chatService.getMessages(
    parseInt(req.params.matchId, 10),
    req.userId,
    pagination,
  );
  return ApiResponse.success(res, result);
});

const sendMessage = asyncHandler(async (req, res) => {
  const matchId = parseInt(req.params.matchId, 10);
  const senderId = req.userId;
  const content = req.body.content;

  const message = await chatService.sendMessage(matchId, senderId, content);

  // Broadcast via Socket.io
  try {
    const io = getIO();
    io.to(`match:${matchId}`).emit('chat:message', {
      id: message.id,
      match_id: message.match_id,
      sender_id: message.sender_id,
      content: message.content,
      created_at: message.created_at,
    });

    // Notificar o outro usuário
    const match = await matchRepository.findById(matchId);
    const otherUserId = match.user_1_id === senderId ? match.user_2_id : match.user_1_id;

    io.to(`user:${otherUserId}`).emit('chat:notification', {
      matchId,
      message: content,
      senderId,
    });

    // Enviar Push Notification
    const sender = await db('users').where({ id: senderId }).first();
    await pushService.sendChatNotification(otherUserId, sender, content, matchId);
  } catch (err) {
    console.warn('Socket/Push broadcast falhou:', err.message);
  }

  return ApiResponse.created(res, message, 'Mensagem enviada.');
});

module.exports = { getMessages, sendMessage };
