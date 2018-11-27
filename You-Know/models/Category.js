const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  categoryApiId: Array,
  categoryApiName: Array
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
