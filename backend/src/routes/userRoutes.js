const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { compressAvatar } = require('../middlewares/compressionMiddleware');


const router = Router();

// Protected routes (must be before /:id to avoid conflicts)
router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/me/avatar', uploadSingle, compressAvatar, userController.updateAvatar);

// Public: get a user's public profile and items (must be last)
router.get('/:id', userController.getPublicProfile);

module.exports = router;
