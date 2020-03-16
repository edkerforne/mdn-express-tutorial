require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/*
 * Set up routes
 */
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/author');
const bookRouter = require('./routes/book');
const bookinstanceRouter = require('./routes/bookinstance');
const genreRouter = require('./routes/genre');

/*
 * Set up Mongoose connection
 */
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

/*
 * Set up view engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*
 * Middleware
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Handle routes
 */
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);
app.use('/copies', bookinstanceRouter);
app.use('/genres', genreRouter);

/*
 * Catch 404 and forward to error handler
 */
app.use((req, res, next) => {
  next(createError(404));
});

/*
 * Handle errors
 */
app.use((err, req, res) => {
  // Only provide errors in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
