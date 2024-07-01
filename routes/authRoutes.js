const express = require('express');
const { signup, verifyEmail ,login , resetPassword , setNewPassword} = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/set-new-password', setNewPassword);

module.exports = router;
