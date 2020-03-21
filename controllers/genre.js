const Genre = require('../models/genre');
const Book = require('../models/book')
const async = require('async');

// Display list of all genres
exports.list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, data) => {
      if (err) return next(err);
      res.render('genreList', { title: 'List of genres', list: data });
  });
};

// Display page of a specific genre
exports.page = (req, res, next) => {
  async.parallel({
    genre: callback => {
      Genre.findById(req.params.id).exec(callback);
    },
    books: callback => {
      Book.find({ 'genre': req.params.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data) {
      const err = new Error('Genre not found');
      err.status = 404;
      next(err);
    }
    res.render('genrePage', { title: `${data.genre.name} Books`, genre: data.genre, books: data.books });
  });
};

// Display genre create form on GET
exports.createGet = (req, res) => {
  res.send('TODO: Genre create GET');
};

// Handle genre create on POST
exports.createPost = (req, res) => {
  res.send('TODO: Genre create POST');
};

// Display genre delete form on GET
exports.deleteGet = (req, res) => {
  res.send('TODO: Genre delete GET');
};

// Handle genre delete on POST
exports.deletePost = (req, res) => {
  res.send('TODO: Genre delete POST');
};

// Display genre update form on GET
exports.updateGet = (req, res) => {
  res.send('TODO: Genre update GET');
};

// Handle genre update on POST
exports.updatePost = (req, res) => {
  res.send('TODO: Genre update POST');
};
