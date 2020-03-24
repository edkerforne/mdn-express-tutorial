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
      if (typeof req.body.genre === undefined) {
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
exports.deleteGet = (req, res, next) => {
  async.parallel({
    book: callback => {
      Book.findById(req.params.id).populate('author').exec(callback);
    },
    bookInstances: callback => {
      BookInstance.find({ 'book': req.params.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data.book) res.redirect('/books'); // No results
    res.render('bookDelete', {
      title: 'Delete book',
      book: data.book,
      bookInstances: data.bookInstances
    });
  });
};

/*
 * Handle book delete on POST
 */
exports.deletePost = (req, res, next) => {
  async.parallel({
    book: callback => {
      Book.findById(req.body.id).exec(callback);
    },
    bookInstances: callback => {
      BookInstance.find({ 'book': req.body.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);

    if (data.bookInstances.length < 0) {
      // Book has instances, so render form again just like GET route
      res.render('bookDelete', {
        title: 'Delete book',
        book: data.book,
        bookInstances: data.bookInstances
      });
      return;
    } else {
      // Book has no instances, so delete and redirect to book list
      Book.findByIdAndRemove(req.body.id, err => {
        if (err) return next(err);
        res.redirect('/books');
      });
    }
  });
};

/*
 * Display book update form on GET
 */
exports.updateGet = (req, res, next) => {

  // Get book, authors and genres for form
  async.parallel({
    book: callback => {
      Book.findById(req.params.id)
        .populate('author').populate('genres')
        .exec(callback);
    },
    authors: callback => {
      Author.find(callback);
    },
    genres: callback => {
      Genre.find(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data.book) {
      // No results
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    // Success, so mark selected genres as checked
    for (let i = 0; i < data.genres.length; i++) {
      for (let j = 0; j < data.book.genre.length; j++) {
        if (data.genres[i]._id.toString() === data.book.genre[j]._id.toString()) {
          data.genres[i].checked = 'true';
        }
      }
    }
    res.render('bookForm', {
      title: 'Update a book',
      authors: data.authors,
      genres: data.genres,
      book: data.book
    });
  });
};

/*
 * Handle book update on POST
 */
exports.updatePost = [

  // Convert genre to an array
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
  body('genre.*').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create book object with escaped and trimmed data
    // and the old ID
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      _id: req.params.id
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
        for (let i = 0; i < data.genres.length; i++) {
          if (book.genre.indexOf(data.genres[i]._id > -1)) {
            data.genres[i].checked = 'true';
          }
        }
        res.render('bookForm', {
          title: 'Update a book',
          authors: data.authors,
          genres: data.genres,
          book: book,
          errors: errors.array()
        });
      });
      return;
    } else {
      // Form data is valid, update book
      // and redirect to its page
      Book.findByIdAndUpdate(req.params.id, book, {}, err => {
        if (err) return next(err);
        res.redirect(book.url);
      });
    }
  }
];
