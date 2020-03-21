const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');

// Display list of all authors
exports.list = (req, res, next) => {
  Author.find()
    .populate('author')
    .sort([['name.first', 'ascending']])
    .exec((err, data) => {
      if (err) return next(err);
      res.render('authorList', { title: 'List of authors', list: data });
    });
};

// Display page of a specific author
exports.page = (req, res, next) => {
  async.parallel({
    author: callback => {
      Author.findById(req.params.id).exec(callback)
    },
    books: callback => {
      Book.find({ 'author': req.params.id }, 'title summary')
        .exec(callback)
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    res.render('authorPage', {
      title: data.author.fullname,
      author: data.author,
      books: data.books
    });
  });
};

// Display author create form on GET
exports.createGet = (req, res) => {
  res.send('TODO: Author create GET');
};

// Handle author create on POST
exports.createPost = (req, res) => {
  res.send('TODO: Author create POST');
};

// Display author delete form on GET
exports.deleteGet = (req, res) => {
  res.send('TODO: Author delete GET');
};

// Handle author delete on POST
exports.deletePost = (req, res) => {
  res.send('TODO: Author delete POST');
};

// Display author update form on GET
exports.updateGet = (req, res) => {
  res.send('TODO: Author update GET');
};

// Handle author update on POST
exports.updatePost = (req, res) => {
  res.send('TODO: Author update POST');
};
