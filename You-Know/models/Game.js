const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  userId: String,
  category: String,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard", "any"]
  },
  numberQuestions: Number,
  questionsAnswered: Number,
  questionsCorrect: Number,
  questionsFailed: Number,
  points: Number
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
