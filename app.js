var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

var indexRouter = require('./src/routes/index');
var authRouter = require('./src/routes/auth');

// initialize app with express
var app = express();

// Allow all origins for development 
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Check if dev or production in order to use .env file
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// Connect to Mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = process.env.MONGODB_DEV_URL;
const mongoDB = process.env.MONGODB_URL || dev_db_url;
main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
}

//passport stuff
require('./src/functions/passportStrats')
const passport = require("passport");
app.use(passport.initialize());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
