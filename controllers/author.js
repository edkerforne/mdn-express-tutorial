const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

/*
 * Display list of all authors
 */
exports.list = (req, res, next) => {
  Author.find()
    .populate('author')
    .sort([['name.first', 'ascending']])
    .exec((err, data) => {
      if (err) return next(err);
      res.render('authorList', { title: 'List of authors', list: data });
    });
};

/*
 * Display page of a specific author
 */
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

/*
 * Display author create form on GET
 */
exports.createGet = (req, res) => {
  res.render('authorForm', { title: 'Add an author' });
};

/*
 * Handle author create on POST
 */
exports.createPost = [

  // Validate fields
  body('firstName')
    .isLength({ min: 1 }).trim().withMessage('Must not be empty')
    .isAlphanumeric().withMessage('Must only contain alphanumeric characters'),

  body('lastName')
    .isLength({ min: 1 }).trim().withMessage('Must not be empty')
    .isAlphanumeric().withMessage('Must only contain alphanumeric characters'),

  body('dateOfBirth', 'Invalid date')
    .optional({ checkFalsy: true }).isISO8601(),

  body('dateOfDeath', 'Invalid date')
    .optional({ checkFalsy: true }).isISO8601(),

  // Sanitize input
  body('firstName').escape(),
  body('lastName').escape(),
  body('dateOfBirth').toDate(),
  body('dateOfDeath').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract validation errors from the request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      // There are errors, so render the form again with
      // sanitized values & error messages
      res.render('authorForm', { 
        title: 'Add an author',
        author: req.body,
        errors: errors.array()
      });
      return;
    } else {

      // Form data is valid, create an author with
      // escaped and trimmed data
      const author = new Author({
        name: {
          first: req.body.firstName,
          last: req.body.lastName
        },
        dateOfBirth: req.body.dateOfBirth,
        dateOfDeath: req.body.dateOfDeath
      });

      author.save((err) => {
        if (err) return next(err);

        // Author saved, redirect to its page
        res.redirect(author.url);
      });
    }
  }
];

/*
 *  Display author delete form on GET
 */
exports.deleteGet = (req, res, next) => {
  async.parallel({
    author: callback => {
      Author.findById(req.params.id).exec(callback);
    },
    books: callback => {
      Book.find({ 'author': req.params.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data.author) res.redirect('/authors'); // No results
    res.render('authorDelete', {
      title: 'Delete author',
      author: data.author,
      books: data.books
    });
  });
};

/*
 * Handle author delete on POST
 */
exports.deletePost = (req, res, next) => {
  async.parallel({
    author: callback => {
      Author.findById(req.body.id).exec(callback);
    },
    books: callback => {
      Book.find({ 'author': req.body.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);

    if (data.books.length < 0) {
      // Author has books, so render form again just like GET route
      res.render('authorDelete', {
        title: 'Delete author',
        author: data.author,
        books: data.books
      });
      return;
    } else {
      // Author has no books, so delete and redirect to author list
      Author.findByIdAndRemove(req.body.id, err => {
        if (err) return next(err);
        res.redirect('/authors');
      });
    }
  });
};

/*
 * Display author update form on GET
 */
exports.updateGet = (req, res, next) => {
  Author.findById(req.params.id, (err, data) => {
    if (err) return next(err);
    if (!data) {
      // No results
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    res.render('authorForm', {
      title: 'Update an author',
      author: data
    });
  });
};

/*
 * Handle author update on POST
 */
exports.updatePost = (req, res) => {
  res.send('TODO: Author update POST');
};
