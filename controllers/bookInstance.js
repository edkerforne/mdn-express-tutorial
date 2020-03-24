const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

/*
 * Display list of all book instances
 */
exports.list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, data) => {
      if (err) return next(err);
      res.render('bookInstanceList', { title: 'List of book copies', list: data });
    });
};

/*
 * Display page of a specific book instance
 */
exports.page = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, data) => {
      if (err) return next(err);
      if (!data) {
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      res.render('bookInstancePage', {
        title: `Copy: ${data.book.title}`,
        bookInstance: data
      });
    });
};

/*
 * Display book instance create form on GET
 */
exports.createGet = (req, res, next) => {
  Book.find({}, 'title').exec((err, data) => {
    if (err) return next(err);
    res.render('bookInstanceForm', { title: 'Add a book copy', list: data });
  });
};

/*
 * Handle book instance create on POST
 */
exports.createPost = [
  // Validate fields
  body('book', 'This field is required').trim().isLength({ min: 1 }),
  body('imprint', 'This field is required').trim().isLength({ min: 1 }),
  body('due', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields
  body('book').escape(),
  body('imprint').escape(),
  body('status').trim().escape(),
  body('due').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a book instance with trimmed and escaped data
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due: req.body.due
    });

    if (!errors.isEmpty()) {

      // There are errors, so render form again with
      // sanitized values & error messages
      Book.find({}, 'title').exec((err, data) => {
        if (err) return next(err);
        res.render('bookInstanceForm', {
          title: 'Add a book copy',
          list: data,
          errors: errors.array(),
          bookInstance: bookInstance
        });
      });
      return;
    } else {
      // Form data is valid, save book instance
      bookInstance.save(err => {
        if (err) return next(err);

        // Book instance saved, redirect to its page
        res.redirect(bookInstance.url);
      });
      
    }
  }
];

/*
 * Display book instance delete form on GET
 */
exports.deleteGet = (req, res) => {
  res.send('TODO: Book instance delete GET');
};

/*
 * Handle book instance delete on POST
 */
exports.deletePost = (req, res) => {
  res.send('TODO: Book instance delete POST');
};

/*
 * Display book instance update form on GET
 */
exports.updateGet = (req, res, next) => {
  async.parallel({
    bookInstance: callback => {
      BookInstance.findById(req.params.id).exec(callback);
    },
    list: callback => {
      Book.find({}, 'title').exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data) {
      // No results
      const err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('bookInstanceForm', {
      title: 'Update a book copy',
      bookInstance: data.bookInstance,
      list: data.list
    });
  });
};

/*
 * Handle book instance update on POST
 */
exports.updatePost = [
  // Validate fields
  body('book', 'This field is required').trim().isLength({ min: 1 }),
  body('imprint', 'This field is required').trim().isLength({ min: 1 }),
  body('due', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields
  body('book').escape(),
  body('imprint').escape(),
  body('status').trim().escape(),
  body('due').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {

    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a book instance with trimmed and escaped data
    // and the old ID
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due: req.body.due,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {

      // There are errors, so render form again with
      // sanitized values & error messages
      Book.find({}, 'title').exec((err, data) => {
        if (err) return next(err);
        res.render('bookInstanceForm', {
          title: 'Update a book copy',
          list: data,
          errors: errors.array(),
          bookInstance: bookInstance
        });
      });
      return;
    } else {

      // Form data is valid, update genre
      // and redirect to its page
      BookInstance.findByIdAndUpdate(
        req.params.id,
        bookInstance,
        {},
        err => {
          if (err) return next(err);
          res.redirect(bookInstance.url);
      });
    }
  }
];
