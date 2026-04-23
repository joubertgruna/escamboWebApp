const db = require('../config/database');

class NotificationController {
  /**
   * Salvar subscription de push notifications para o usuário
   * POST /api/notifications/subscribe
   */
  static async subscribeToNotifications(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);
      const { subscription } = req.body;

      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({
          success: false,
          message: 'Subscription endpoint é obrigatório',
        });
      }

      // Verificar se já existe uma subscription deste usuário
      const existingSubscription = await db('push_subscriptions')
        .where({ user_id: userId, endpoint: subscription.endpoint })
        .first();

      if (existingSubscription) {
        return res.status(200).json({
          success: true,
          message: 'Subscription já existe',
          subscription: existingSubscription,
        });
      }

      // Salvar nova subscription
      const [subscriptionId] = await db('push_subscriptions').insert({
        user_id: userId,
        endpoint: subscription.endpoint,
        auth: subscription.keys?.auth || null,
        p256dh: subscription.keys?.p256dh || null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Subscription salva com sucesso',
        subscriptionId,
      });
    } catch (err) {
      console.error('Erro ao salvar subscription:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar subscription',
        error: err.message,
      });
    }
  }

  /**
   * Remover subscription de push notifications
   * DELETE /api/notifications/unsubscribe
   */
  static async unsubscribeFromNotifications(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          success: false,
          message: 'Endpoint é obrigatório',
        });
      }

      const deleted = await db('push_subscriptions')
        .where({ user_id: userId, endpoint })
        .delete();

      res.status(200).json({
        success: true,
        message: 'Subscription removida com sucesso',
        deleted,
      });
    } catch (err) {
      console.error('Erro ao remover subscription:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover subscription',
        error: err.message,
      });
    }
  }

  /**
   * Verificar se usuário tem subscriptions ativas
   * GET /api/notifications/subscription
   */
  static async checkSubscription(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);

      const subscriptions = await db('push_subscriptions')
        .where({ user_id: userId })
        .select('id', 'endpoint', 'created_at');

      res.status(200).json({
        success: true,
        subscribed: subscriptions.length > 0,
        subscriptionCount: subscriptions.length,
        subscriptions,
      });
    } catch (err) {
      console.error('Erro ao verificar subscription:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar subscription',
        error: err.message,
      });
    }
  }

  /**
   * Listar notificações do usuário
   * GET /api/notifications?limit=20&page=0
   */
  static async listNotifications(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);
      const limit = parseInt(req.query.limit, 10) || 20;
      const page = Math.max(parseInt(req.query.page, 10) || 0, 0);

      // Tenta buscar na tabela 'notifications' - se não existir, retorna lista vazia
      let notifications = [];
      try {
        notifications = await db('notifications')
          .where({ user_id: userId })
          .orderBy('created_at', 'desc')
          .limit(limit)
          .offset(page * limit);
      } catch (innerErr) {
        // tabela pode não existir ainda — não é crítico, retornamos vazio
        console.warn('Tabela notifications ausente ou erro na query:', innerErr.message);
        notifications = [];
      }

      res.status(200).json({
        success: true,
        data: notifications,
        count: notifications.length,
      });
    } catch (err) {
      console.error('Erro ao listar notificações:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao listar notificações',
        error: err.message,
      });
    }
  }

  /**
   * Marcar notificação como lida
   * PUT /api/notifications/:id/read
   */
  static async markAsRead(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);
      const id = parseInt(req.params.id, 10);

      const updated = await db('notifications')
        .where({ id, user_id: userId })
        .update({ read_at: db.fn.now() });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
      }

      res.status(200).json({ success: true, message: 'Notificação marcada como lida' });
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      res.status(500).json({ success: false, message: 'Erro ao atualizar notificação', error: err.message });
    }
  }

  /**
   * Deletar notificação do usuário
   * DELETE /api/notifications/:id
   */
  static async deleteNotification(req, res) {
    try {
  const userId = req.userId || (req.user && req.user.id);
      const id = parseInt(req.params.id, 10);

      const deleted = await db('notifications').where({ id, user_id: userId }).del();

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
      }

      res.status(200).json({ success: true, message: 'Notificação removida' });
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
      res.status(500).json({ success: false, message: 'Erro ao deletar notificação', error: err.message });
    }
  }
}

module.exports = NotificationController;
