const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  category: {
    type: String
  },
  type: {
    type: String
  },
  difficulty: {
    type: String
  },
  question: {
    type: String,
  },
  answers: [{ type : Schema.ObjectId, ref: 'Answer' }]
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
