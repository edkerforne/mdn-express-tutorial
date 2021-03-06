const Genre = require('../models/genre');
const Book = require('../models/book')
const async = require('async');
const { body, validationResult } = require('express-validator');

/*
 * Display list of all genres
 */
exports.list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, data) => {
      if (err) return next(err);
      res.render('genreList', { title: 'List of genres', list: data });
  });
};

/*
 * Display page of a specific genre
 */
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

/*
 * Display genre create form on GET
 */
exports.createGet = (req, res) => {
  res.render('genreForm', { title: 'Add a genre' });
}

/*
 * Handle genre create on POST
 */
exports.createPost = [
  
  // Validate that the name has between 3 and 100 characters
  body('name')
    .isLength({ min: 3 }).trim().withMessage('Must be at least 3 characters long')
    .isLength({ max: 100 }).withMessage('Must be shorter than 100 characters'),
  
  // Sanitize the name field
  body('name').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    
    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create a genre object with sanitized data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      
      // There are errors, so render the form again with
      // sanitized values & error messages
      res.render('genreForm', {
        title: 'Add a genre',
        genre: genre,
        errors: errors.array()
      });
    } else {
      
      // Form data is valid, check if genre with
      // same name already exists
      Genre.findOne({ 'name': req.body.name })
        .exec((err, data) => {
          if (err) return next(err);
          if (data) {
            
            // Genre exists, redirect to its page
            res.redirect(data.url);
          } else {

            genre.save(err => {
              if (err) return next(err);
              
              // Genre saved, redirect to its page
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

/*
 * Display genre delete form on GET
 */
exports.deleteGet = (req, res, next) => {
  async.parallel({
    genre: callback => {
      Genre.findById(req.params.id).exec(callback);
    },
    books: callback => {
      Book.find({ 'genre': req.params.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);
    if (!data.genre) res.redirect('/genres'); // No results
    res.render('genreDelete', {
      title: 'Delete genre',
      genre: data.genre,
      books: data.books
    });
  });
};

/*
 * Handle genre delete on POST
 */
exports.deletePost = (req, res, next) => {
  async.parallel({
    genre: callback => {
      Genre.findById(req.body.id).exec(callback);
    },
    books: callback => {
      Book.find({ 'genre': req.body.id }).exec(callback);
    }
  }, (err, data) => {
    if (err) return next(err);

    if (data.books.length < 0) {
      // Genre has books, so render form again just like GET route
      res.render('genreDelete', {
        title: 'Delete genre',
        genre: data.genre,
        books: data.books
      });
      return;
    } else {
      // Genre has no books, so delete and redirect to author list
      Genre.findByIdAndRemove(req.body.id, err => {
        if (err) return next(err);
        res.redirect('/genres');
      });
    }
  });
};

/*
 * Display genre update form on GET
 */
exports.updateGet = (req, res, next) => {
  Genre.findById(req.params.id, (err, data) => {
    if (err) return next(err);
    if (!data) {
      // No results
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genreForm', {
      title: 'Update a genre',
      genre: data
    });
  });
};

/*
 * Handle genre update on POST
 */
exports.updatePost = [

  // Validate that the name has between 3 and 100 characters
  body('name')
    .isLength({ min: 3 }).trim().withMessage('Must be at least 3 characters long')
    .isLength({ max: 100 }).withMessage('Must be shorter than 100 characters'),
  
  // Sanitize the name field
  body('name').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    
    // Extract validation errors from the request
    const errors = validationResult(req);

    // Create a genre object with sanitized data
    // and the old ID
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      
      // There are errors, so render the form again with
      // sanitized values & error messages
      res.render('genreForm', {
        title: 'Update a genre',
        genre: genre,
        errors: errors.array()
      });
    } else {
      
      // Form data is valid, check if genre with
      // same name already exists
      Genre.findOne({ 'name': req.body.name })
        .exec((err, data) => {
          if (err) return next(err);
          if (data) {
            
            // Genre exists, redirect to its page
            res.redirect(data.url);
          } else {
            
            // Form date is valid, update genre
            // and redirect to its page
            Genre.findByIdAndUpdate(req.params.id, genre, {}, err => {
              if (err) return next(err);
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];
