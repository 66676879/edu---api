const express = require('express');
const { createTeam, editTeam, joinTeam, getTeams } = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/', protect , createTeam);
router.put('/:id', protect, upload.single('photo'), editTeam);
router.post('/join', protect, joinTeam);
router.get('/', protect, getTeams);

module.exports = router;
