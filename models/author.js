const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
authorSchema.virtual('fullname').get(() => {
  return `${this.name.first} ${this.name.last}`;
});

// Virtual for author's lifespan
authorSchema.virtual('lifespan').get(() => {
  return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear());
});

// Virtual for author's URL
authorSchema.virtual('url').get(() => {
  return `/author/${this._id}`;
});

// Export model
module.exports = mongoose.model('Author', authorSchema);
