const express = require('express');
const { editProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.put('/profile', protect, upload.single('photo'), editProfile);
router.get('/profile', protect, getProfile);

module.exports = router;
