const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');

// Create a new team
exports.createTeam = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    const team = new Team({
      name,
      photo: req.file ? req.file.path : '',
      admin: req.user.id,
      code: Math.random().toString(36).substring(2, 10), // Generates a random team code
    });

    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a team
exports.editTeam = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const team = await Team.findOne({ team_id: req.params.id });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    //console.log(`${team.admin.toString()}`)
    //console.log(`${req.user._id}`)

    team.name = name || team.name;
    if (req.file) {
      team.photo = req.file.path;
    }

    const updatedTeam = await team.save();
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a team with a code
exports.joinTeam = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;

    const team = await Team.findOne({ code });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    team.members.push(req.user._id);
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get teams where the user is a member
exports.getTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
