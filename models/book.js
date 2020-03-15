const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre'
  }]
});

// Virtual for book's URL
bookSchema.virtual('url').get(() => {
  return `/book/${this._id}`;
});

// Export model
module.exports = mongoose.model('Book', bookSchema);
