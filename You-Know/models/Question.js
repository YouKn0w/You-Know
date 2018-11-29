const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

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
questionSchema.plugin(random)

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
