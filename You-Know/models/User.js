const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  email: {
    type: String,
    unique: true
  },
  imagePath: String,
  status: {
    type: String,
    enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  gameId: mongoose.Types.ObjectId,
  points: Number,
  stadistics: {
    general: {
      correct: Number,
      failed: Number
    },
    entertainment: {
      correct: Number,
      failed: Number
    },
    science: {
      correct: Number,
      failed: Number
    },
    art: {
      correct: Number,
      failed: Number
    },
    historyAndGeography: {
      correct: Number,
      failed: Number
    },
    sports: {
      correct: Number,
      failed: Number
    },
    ironhack: {
      correct: Number,
      failed: Number
    }
  }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
