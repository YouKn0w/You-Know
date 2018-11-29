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
  points: {
    type: Number,
    default: 0,
  },
  stadistics: {
    general: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    entertainment: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    science: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    art: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    historyAndGeography: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    sports: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    },
    ironhack: {
      correct: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
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
