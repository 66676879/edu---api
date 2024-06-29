const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
  {
    team_id: {
      type: String,
      required: true,
      unique: true ,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
