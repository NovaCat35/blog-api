var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

// initialize app with express
var app = express();

// Check if dev or production in order to use .env file
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// Allow all origins for development
app.use(cors());
app.use((req, res, next) => {
	const allowedOrigins = ["http://localhost:5173/", "https://wayfarers-frontier.pages.dev/"];
	const origin = req.headers.origin;

	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}

	res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	next();
});

// Routes
var indexRouter = require("./dist/routes/index");
var authRouter = require("./dist/routes/auth");

/* ************** */
/** PRODUCTION **/
/* ************** */
// Set up rate limiter: maximum of ? requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 1000,
});

// Apply rate limiter to all requests
app.use(limiter);

// Add helmet for production security
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'"],
		},
	})
);
app.use(compression()); // Compress all routes
/* ************** */

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

//passport stuff (must be place before using routes)
require("./dist/functions/passportStrats");
const passport = require("passport");
app.use(passport.initialize());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// use routes
app.use("/", indexRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// Connect to Mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = process.env.MONGODB_DEV_URL;
const mongoDB = process.env.MONGODB_URL || dev_db_url;
main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
}

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
