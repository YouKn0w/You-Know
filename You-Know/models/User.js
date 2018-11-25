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
  status: {
    type: String,
    enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  points: Number,
  stadistics: {
    General: {
      Correct: Number,
      Failed: Number
    },
    Entertainment: {
      Correct: Number,
      Failed: Number
    },
    Science: {
      Correct: Number,
      Failed: Number
    },
    Art: {
      Correct: Number,
      Failed: Number
    },
    History: {
      Correct: Number,
      Failed: Number
    },
    Sports: {
      Correct: Number,
      Failed: Number
    },
    Ironhack: {
      Correct: Number,
      Failed: Number
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
