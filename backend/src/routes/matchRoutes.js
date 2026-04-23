const { Router } = require('express');
const matchController = require('../controllers/matchController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { sendMessageSchema } = require('../validators/chatValidator');

const router = Router();

router.use(authMiddleware);

router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatch);
router.post('/:id/ad-shown', matchController.markAdShown);

// Chat routes under matches
router.get('/:matchId/messages', chatController.getMessages);
router.post('/:matchId/messages', validate(sendMessageSchema), chatController.sendMessage);

module.exports = router;
