const webpush = require('web-push');
const db = require('../config/database');
const logger = require('../utils/logger');

// Configurar VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:contato@escambo.app';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  logger.info('✅ Web Push configurado com VAPID keys');
} else {
  logger.warn('⚠️ VAPID keys não configuradas - Push notifications desabilitadas');
}

class PushService {
  /**
   * Enviar push notification para um usuário específico
   * @param {number} userId - ID do usuário
   * @param {object} payload - Dados da notificação
   */
  async sendToUser(userId, payload) {
    if (!vapidPublicKey || !vapidPrivateKey) {
      logger.warn('Push notification não enviada: VAPID keys não configuradas');
      return { sent: 0, failed: 0 };
    }

    try {
      // Buscar todas as subscriptions do usuário
      const subscriptions = await db('push_subscriptions')
        .where({ user_id: userId })
        .select('id', 'endpoint', 'auth', 'p256dh');

      if (subscriptions.length === 0) {
        logger.info(`Usuário ${userId} não tem subscriptions de push`);
        return { sent: 0, failed: 0 };
      }

      const results = { sent: 0, failed: 0, errors: [] };

      // Enviar para todas as subscriptions
      for (const sub of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          results.sent++;
          logger.info(`✅ Push enviado para user ${userId} (subscription ${sub.id})`);
        } catch (err) {
          results.failed++;
          results.errors.push(err.message);

          // Se a subscription expirou ou é inválida, remover
          if (err.statusCode === 404 || err.statusCode === 410) {
            await db('push_subscriptions').where({ id: sub.id }).delete();
            logger.info(`🗑️ Subscription ${sub.id} removida (expirada)`);
          } else {
            logger.error(`❌ Erro ao enviar push para subscription ${sub.id}:`, err.message);
          }
        }
      }

      return results;
    } catch (err) {
      logger.error('Erro ao enviar push notifications:', err);
      throw err;
    }
  }

  /**
   * Enviar notificação de nova mensagem no chat
   * @param {number} recipientId - ID do destinatário
   * @param {object} sender - Dados do remetente
   * @param {string} messagePreview - Preview da mensagem
   * @param {number} matchId - ID do match
   */
  async sendChatNotification(recipientId, sender, messagePreview, matchId) {
    const payload = {
      title: `Nova mensagem de ${sender.name}`,
      body: messagePreview.substring(0, 100),
      icon: sender.avatar_url || '/icons/icon-192x192.png',
      badge: '/favicon.ico',
      tag: `chat-${matchId}`,
      data: {
        type: 'chat',
        matchId,
        senderId: sender.id,
        url: `/chat/${matchId}`,
      },
    };

    return this.sendToUser(recipientId, payload);
  }

  /**
   * Enviar notificação de novo match
   * @param {number} recipientId - ID do destinatário
   * @param {object} otherUser - Dados do outro usuário
   * @param {number} matchId - ID do match
   */
  async sendMatchNotification(recipientId, otherUser, matchId) {
    const payload = {
      title: '🎉 Novo Match!',
      body: `Você deu match com ${otherUser.name}! Comece a trocar mensagens.`,
      icon: otherUser.avatar_url || '/icons/icon-192x192.png',
      badge: '/favicon.ico',
      tag: `match-${matchId}`,
      data: {
        type: 'match',
        matchId,
        userId: otherUser.id,
        url: `/chat/${matchId}`,
      },
    };

    return this.sendToUser(recipientId, payload);
  }

  /**
   * Enviar notificação de novo like
   * @param {number} recipientId - ID do destinatário
   * @param {object} item - Item que recebeu o like
   */
  async sendLikeNotification(recipientId, item) {
    const payload = {
      title: '❤️ Novo interesse!',
      body: `Alguém curtiu seu item: ${item.title}`,
      icon: '/icons/icon-192x192.png',
      badge: '/favicon.ico',
      tag: `like-${item.id}`,
      data: {
        type: 'like',
        itemId: item.id,
        url: `/items/${item.id}`,
      },
    };

    return this.sendToUser(recipientId, payload);
  }
}

module.exports = new PushService();
