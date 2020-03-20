const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookinstanceSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  imprint: {},
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance'
  },
  due: {
    type: Date,
    default: Date.now
  }
});

// Virtual for book instance's URL
bookinstanceSchema.virtual('url').get(function() {
  return `/copy/${this._id}`;
});

// Export model
module.exports = mongoose.model('BookInstance', bookinstanceSchema);
