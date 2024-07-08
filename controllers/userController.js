const User = require('../models/User');
const Team = require('../models/Team');

const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// Edit user profile
exports.editProfile = asyncHandler(async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.body.userId; // Get the user ID from the request body
 
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.dob = req.body.dob || user.dob;
    if (req.file) {
      user.photo = req.file.path;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      photo: updatedUser.photo,
      //token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


exports.getProfile = async (req, res) => {
  try {
    const userId = req.body.userId; // Get the user ID from the request body
    console.log(`${userId}`)
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to leave a team
exports.leaveTeam = asyncHandler(async (req, res) => {
  try {
    const { team_id } = req.body;
    const userId = req.user._id;

    const team = await Team.findOne({ team_id });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove user from team members if they are a member
    if (team.members.includes(userId)) {
      team.members.pull(userId);
      await team.save();

      // Optionally, remove the team from the user's teams list
      await User.findByIdAndUpdate(userId, { $pull: { teams: team_id } });

      res.status(200).json({ message: 'Left team successfully', team });
    } else {
      res.status(400).json({ message: 'User is not a member of the team' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});