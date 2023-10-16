var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
require('dotenv').config();

var credentials = require('./middleware/credentials');
const session = require('express-session'); // Session
const passport = require('passport'); // Passport for OAuth2


var indexRouter = require('./routes/index');

var app = express();

// Configure session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a better key? 
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Handle the options credentials check - Before any potential CORS & fetch cookies credential requirement 
app.use(credentials);


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err })
});

module.exports = app;
