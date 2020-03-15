const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/*
 * Set up routes
 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

/*
 * Set up view engine
 */
const app = express();
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
app.use('/users', usersRouter);

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
