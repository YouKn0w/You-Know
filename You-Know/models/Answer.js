const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  value: String, 
  correct: Boolean
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
