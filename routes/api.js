const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const userRouter = require('./user');
const articleRouter = require('./article');
const commentRouter = require('./comment');
const adminRouter = require('./admin');

// For hash the passwords
// const { hashPassword, comparePasswords } = require('../tools/hashPassword'); // Not working

// ************************************************************************************
// ************************************************************************************
// Get the / page
router.get('/', (req, res) => {
	res.redirect('/api/login');
});

// ************************************************************************************
// ************************************************************************************
// Check if a user has session or not
const checkSession = (req, res, next) => {
	if (!req.session.user) return res.redirect('/api/login');
	next();
};

// ************************************************************************************
// ************************************************************************************
// check if the user making the request is login or not
const isLogin = (req, res, next) => {
	if (req.session.user) return res.redirect('/api/user/dashboard');
	next();
};

// ************************************************************************************
// ************************************************************************************

// Routers
router.use('/user', checkSession, userRouter);
router.use('/articles', checkSession, articleRouter);
router.use('/comments', checkSession, commentRouter);
router.use('/admin', checkSession, adminRouter);

// *******************************************************************************************************
// *******************************************************************************************************
// USER SIGN-UP

// Send signup page
router.get('/signup', isLogin, (req, res) => {
	res.render('pages/signup.ejs');
});

// Signup process
router.post('/signup', (req, res) => {
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
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					// Saving new blogger process
					const newBlogger = new User({
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						userName: req.body.userName,
						sex: req.body.sex,
						mobile: req.body.mobile,
						password: hash,
						role: 'blogger',
					});

					newBlogger.save((err, user) => {
						if (err) {
							return res.status(500).send('Some internal problem happened. Please try again.');
						} else {
							return res.status(200).send('Your account created successfully.');
						}
					});
				})
				.catch((err) => {
					return err;
				});
		}
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// USER LOGIN

// Send login page
router.get('/login', isLogin, (req, res) => {
	res.render('pages/login.ejs');
});

// Request for login
router.post('/login', (req, res) => {
	// Check for empty fields
	if (!req.body.userName || !req.body.password) {
		return res.status(500).send('Empty fields not allowed');
	}
	// Find user
	User.findOne({ userName: req.body.userName }, (err, blogger) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		}
		if (!blogger) {
			return res.status(500).send('Incorrect username or password.');
		} else {
			// Compare passwords
			bcrypt
				.compare(req.body.password, blogger.password)
				.then((result) => {
					if (result) {
						// Assign the blogger info to its session
						req.session.user = blogger;
						// Sending the logged in blogger to his dashboard page
						res.status(200).send('Welcome');
					} else {
						return res.status(500).send('Incorrect username or password.');
					}
				})
				.catch((err) => {
					return res.status(500).send('Something went wrong!');
				});
		}
	});
});

// ************************************************************************************
// ************************************************************************************
// Admin login
router.get('/login/admin', (req, res) => {
	res.render('pages/loginAdmin.ejs');
});

router.post('/login/admin', (req, res) => {
	// Check for empty fields
	if (!req.body.userName || !req.body.password) {
		return res.status(500).send('Empty fields not allowed');
	}
	// Find user
	User.findOne({ userName: req.body.userName }, (err, admin) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		}
		if (!admin) {
			return res.status(500).send('Incorrect username or password.');
		}
		if (admin.role !== 'admin') {
			return res.status(401).send('You do not have permission!');
		} else {
			// Compare passwords
			bcrypt
				.compare(req.body.password, admin.password)
				.then((result) => {
					if (result) {
						// Assign the blogger info to its session
						req.session.user = admin;
						// Sending the logged in blogger to his dashboard page
						res.status(200).send('Welcome');
					} else {
						return res.status(500).send('Incorrect username or password.');
					}
				})
				.catch((err) => {
					return res.status(500).send('Something went wrong!');
				});
		}
	});
});
// ************************************************************************************
// ************************************************************************************

module.exports = router;
