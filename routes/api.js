const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const router = express.Router();
const userRouter = require('./user');

// Configure the multer for image uploading
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});
const upload = multer({ storage: storage });

// Get the / page
router.get('/', (req, res) => {
	res.send('<h2>Please <a href="/api/signup">sign-up</a> or <a href="/api/login">login</a></h2>');
});

// Check if a user has session or not
const checkSession = (req, res, next) => {
	if (!req.session.user) return res.redirect('/api/signup');
	next();
};

// check if the user making the request is login or not
const isLogin = (req, res, next) => {
	if (req.session.user) return res.redirect('/api/user/dashboard');
	next();
};

// Routers
router.use('/user', checkSession, userRouter);
// router.use('/article', checkSession, userRouter);
// router.use('/comment', checkSession, userRouter);

// Send signup page
router.get('/signup', isLogin, (req, res) => {
	res.render('pages/signup.ejs');
});

// Signup process
router.post('/signup', isLogin, upload.single('avatar'), (req, res) => {
	console.log(req.file);
	// Check for empty fields
	if (!req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.sex || !req.body.mobile || !req.body.password || !req.body.password2) {
		return res.status(500).send('Empty fields not allowed');
	}

	// Check for restrictions
	// First Name
	if (req.body.firstName.length < 3 || req.body.firstName.length > 30) {
		return res.status(500).send('First name length must be greater than 3 and less than 30 characters.');
	}
	// Last Name
	if (req.body.lastName.length < 3 || req.body.lastName.length > 30) {
		return res.status(500).send('Last name length must be greater than 3 and less than 30 characters.');
	}
	// Username
	if (req.body.userName.length < 3 || req.body.userName.length > 30) {
		return res.status(500).send('Username length must be greater than 3 and less than 30 characters.');
	}
	// Password
	if (req.body.password.length < 8 || req.body.password.length > 30) {
		return res.status(500).send('Password length must be greater than 3 and less than 30 characters.');
	}
	// Passwords Match
	if (req.body.password !== req.body.password2) {
		return res.status(500).send('Passwords do not match');
	}

	// Check if the username or mobile number is already exists or not
	User.findOne({ $or: [{ userName: req.body.userName }, { mobile: req.body.mobile }] }, (err, user) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else if (user) {
			return res.status(500).send('This username or phone number is already taken. Please check your info.');
		} else {
			// Saving new blogger process
			const newBlogger = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				userName: req.body.userName,
				sex: req.body.sex,
				mobile: req.body.mobile,
				password: req.body.password,
				avatar: req.file.filename,
			});

			newBlogger.save((err, user) => {
				if (err) {
					return res.status(500).send('Some internal problem happened. Please try again.');
				} else {
					return res.status(200).send('Your account created successfully.');
				}
			});
		}
	});
});

// Send login page
router.get('/login', isLogin, (req, res) => {
	res.render('pages/login.ejs');
});

// Request for login
router.post('/login', isLogin, (req, res) => {
	// Check for empty fields
	if (!req.body.userName || !req.body.password) {
		return res.status(500).send('Empty fields not allowed');
	}
	// Find user
	User.findOne({ userName: req.body.userName, password: req.body.password }, (err, blogger) => {
		if (err) {
			return res.status(500).send('Incorrect username or password.');
		}

		// Assign the blogger info to its session
		req.session.user = blogger;

		// Sending the logged in blogger to his dashboard page
		res.redirect('/api/user/dashboard');
	});
});

module.exports = router;
