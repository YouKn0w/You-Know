const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  answeredQuestions: Number,
  totalQuestions: Number,
  difficulty: {
    type: String,
    enum: ["easy, medium, hard"]
  },
  points: Number
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
