const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  totalQuestions: Number,
  questions: [{ type : Schema.Types.ObjectId, ref: 'Question' }], 
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard", "any"]
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
