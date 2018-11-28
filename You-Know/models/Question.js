const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: String
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
  },
  answers: [{ type : Schema.ObjectId, ref: 'Answer' }]
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
