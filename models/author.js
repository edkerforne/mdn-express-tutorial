const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const authorSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true,
      max: 100
    },
    last: {
      type: String,
      required: true,
      max: 100
    }
  },
  dateOfBirth: Date,
  dateOfDeath: Date
});

// Virtual for author's full name
authorSchema.virtual('fullname').get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Virtual for author's formatted dates of birth and death
authorSchema.virtual('lifespan').get(function() {
  const birth = this.dateOfBirth
    ? moment(this.dateOfBirth).format('MMMM Do, YYYY')
    : '';
  const death = this.dateOfDeath
    ? moment(this.dateOfDeath).format('MMMM Do, YYYY')
    : '';
  return (birth || death) ? `${birth}–${death}` : '';
});

// Virtual for author's URL
authorSchema.virtual('url').get(function() {
  return `/authors/${this._id}`;
});

// Export model
module.exports = mongoose.model('Author', authorSchema);
