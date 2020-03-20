const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 100
  }
});

// Virtual for genre's URL
genreSchema.virtual('url').get(() => {
  return `/genre/${this._id}`;
});

// Export model
module.exports = mongoose.model('Genre', genreSchema);