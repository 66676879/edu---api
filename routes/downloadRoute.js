const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// Route to download the file
router.get('/download', downloadController.downloadFile);

module.exports = router;
