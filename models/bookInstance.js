const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment');

const bookInstanceSchema = new Schema({
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

// Virtual for book Instance's URL
bookInstanceSchema.virtual('url').get(function() {
  return `/copies/${this._id}`;
});

// Virtual for formatted due date
bookInstanceSchema.virtual('dueFormatted').get(function() {
  return moment(this.due).format('MMMM Do, YYYY');
});

// Export model
module.exports = mongoose.model('BookInstance', bookInstanceSchema);
