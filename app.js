const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const apiRouter = require('./routes/api');

const app = express();

// *******************************************************************************************************
// *******************************************************************************************************
// initialize express-session to allow us track the logged-in user across sessions.
app.use(
	session({
		key: 'user_sid',
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000,
		},
	})
);

// *******************************************************************************************************
// *******************************************************************************************************
// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/Final_Project_Weblog', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

// *******************************************************************************************************
// *******************************************************************************************************
// MIDDLEWARE

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up morgan for logging
app.use(logger('dev'));

// create application/json parser
app.use(express.json());

// parse various different custom JSON types as JSON
app.use(express.json({ type: 'application/*+json' }));

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS problem
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', '*');
// 	next();
// });

app.use((req, res, next) => {
	if (req.cookies.user_id && !req.session.user) {
		res.clearCookie('user_id');
	}
	next();
});

// app.use((req, res, next) => {
// console.log(req);
// console.log(req.cookies);
// console.log(req.session);
// next();
// });

app.use('/api', apiRouter);

app.use('/favicon.ico', (req, res) => {
	res.status(404).send('Not found');
});

app.get('/', (req, res) => {
	res.send('<h2>Please <a href="/api/signup">sign-up</a> or <a href="/api/login">login</a></h2>');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	// res.render("error");
});

module.exports = app;
