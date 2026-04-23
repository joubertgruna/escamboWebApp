const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const NotificationController = require('../controllers/notificationController');

// Protege todas as rotas de notificação com autenticação
router.use(authMiddleware);

// POST /api/notifications/subscribe - Salvar subscription de push
router.post('/subscribe', NotificationController.subscribeToNotifications);

// DELETE /api/notifications/unsubscribe - Remover subscription de push
router.delete('/unsubscribe', NotificationController.unsubscribeFromNotifications);

// GET /api/notifications/subscription - Verificar se usuário está inscrito
router.get('/subscription', NotificationController.checkSubscription);

// GET /api/notifications - Lista notificações do usuário (opcional: ?limit=20&page=0)
router.get('/', NotificationController.listNotifications);

// PUT /api/notifications/:id/read - Marcar notificação como lida
router.put('/:id/read', NotificationController.markAsRead);

// DELETE /api/notifications/:id - Remover notificação
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;
