const Book = require('../models/book');
const BookInstance = require('../models/bookInstance');
const Author = require('../models/author');
const Genre = require('../models/genre');
const async = require('async');
const { body, validationResult } = require('express-validator');

/*
 * Display list of all books
 */
exports.list = (req, res, next) => {
  Book.find({}, 'title author')
    .populate('author')
    .exec((err, data) => {
      if (err) return next(err);
      res.render('bookList', { title: 'List of books', list: data });
    });
};

/*
 * Display page of a specific book
 */
exports.page = (req, res, next) => {
  async.parallel({
    book: callback => {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    bookInstances: callback => {
      BookInstance.find({ 'book': req.params.id })
        .exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.render('bookPage', {
      title: data.book.title,
      book: data.book,
      bookInstances: data.bookInstances
    });
  });
};

/*
 * Display book create form on GET
 */
exports.createGet = (req, res, next) => {
  async.parallel({
    authors: callback => {
      Author.find(callback);
    },
    genres: callback => {
      Genre.find(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    res.render('bookForm', {
      title: 'Add a book',
      authors: data.authors,
      genres: data.genres
    });
  });
};

/*
 * Handle book create on POST
 */
exports.createPost = [

  // Convert genres to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate fields
  body('title', 'Must be longer than 3 characters').trim().isLength({ min: 3 }),
  body('author', 'This field is required').trim().isLength({ min: 1 }),
  body('summary', 'This field is required').trim().isLength({ min: 1 }),
  body('isbn', 'This field is required').trim().isLength({ min: 1 }),

  // Sanitize fields
  body('*').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create book object with escaped and trimmed data
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      // There are errors, so render the form again with
      // sanitized values & error messages

      // Get all authors and genres for form
      async.parallel({
        authors: callback => {
          Author.find(callback);
        },
        genres: callback => {
          Genre.find(callback);
        }
      }, (err, data) => {
        if (err) return next(err);

        // Mark selected genres as checked
        for (let i = 0; i < data.genre.length; i++) {
          if (book.genre.indexOf(data.genres[i]._id > -1)) {
            data.genres[i].checked = 'true';
          }
        }
        res.render('bookForm', {
          title: 'Add a book',
          authors: data.authors,
          genres: data.genres,
          book: book,
          errors: errors.array()
        });
      });
    } else {
      // Form data is valid, save book
      book.save(err => {
        if (err) return next(err);

        // Book saved, redirect to its page
        res.redirect(book.url);
      });
    }
  }
];

/*
 * Display book delete form on GET
 */
exports.deleteGet = (req, res) => {
  res.send('TODO: Book delete GET');
};

/*
 * Handle book delete on POST
 */
exports.deletePost = (req, res) => {
  res.send('TODO: Book delete POST');
};

/*
 * Display book update form on GET
 */
exports.updateGet = (req, res) => {
  res.send('TODO: Book update GET');
};

/*
 * Handle book update on POST
 */
exports.updatePost = (req, res) => {
  res.send('TODO: Book update POST');
};
