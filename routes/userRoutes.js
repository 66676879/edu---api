const express = require('express');
const { editProfile, getProfile , leaveTeam } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();


// use user id 
router.put('/profile', upload.single('photo'), editProfile);
router.get('/profile',  getProfile);


router.post('/leave-team', protect, leaveTeam);

module.exports = router;
