const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

const async = require('async');

module.exports = (req, res) => {
  async.parallel({
    bookCount: callback => {
      Book.countDocuments({}, callback);
    },
    bookInstanceCount: callback => {
      BookInstance.countDocuments({}, callback);
    },
    availableBookInstanceCount: callback => {
      BookInstance.countDocuments({ status: 'Available'}, callback);
    },
    authorCount: callback => {
      Author.countDocuments({}, callback);
    },
    genreCount: callback => {
      Genre.countDocuments({}, callback);
    }
  }, (err, results) => {
    res.render('index', { title: 'Home', error: err, data: results });
  });
};
