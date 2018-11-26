const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: String,
    enum: ["ironhack"]
  },
  type: {
    type: String,
    enum: ["multiple", "boolean"]
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },
  question: {
    type: String,
    unique: true,
  },
  correct_answer: {
    type: String,
  },
  incorrect_answers: Array
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
