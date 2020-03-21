const BookInstance = require('../models/bookInstance');

// Display list of all book instances
exports.list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, data) => {
      if (err) return next(err);
      res.render('bookInstanceList', { title: 'List of book copies', list: data });
    });
};

// Display page of a specific book instance
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

// Display book instance create form on GET
exports.createGet = (req, res) => {
  res.send('TODO: Book instance create GET');
};

// Handle book instance create on POST
exports.createPost = (req, res) => {
  res.send('TODO: Book instance create POST');
};

// Display book instance delete form on GET
exports.deleteGet = (req, res) => {
  res.send('TODO: Book instance delete GET');
};

// Handle book instance delete on POST
exports.deletePost = (req, res) => {
  res.send('TODO: Book instance delete POST');
};

// Display book instance update form on GET
exports.updateGet = (req, res) => {
  res.send('TODO: Book instance update GET');
};

// Handle book instance update on POST
exports.updatePost = (req, res) => {
  res.send('TODO: Book instance update POST');
};
