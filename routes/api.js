const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
	res.send('<h2>Please <a href="/api/signup">sign-up</a> or <a href="/api/login">login</a></h2>');
});

// Send signup page
router.get('/signup', (req, res) => {
	res.render('pages/signup.ejs');
});

// Signup process
router.post('/signup', (req, res) => {
	// Check for empty fields
	if (!req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.sex || !req.body.mobile || !req.body.password || !req.body.password2) {
		return res.status(500).json({
			msg: 'Empty fields not allowed',
		});
	}

	// Check for restrictions
	// First Name
	if (req.body.firstName.length < 3 || req.body.firstName.length > 30) {
		return res.status(500).json({
			input: 'firstName',
			msg: 'First name length must be greater than 3 and less than 30 characters.',
		});
	}
	// Last Name
	if (req.body.lastName.length < 3 || req.body.lastName.length > 30) {
		return res.status(500).json({
			input: 'lastName',
			msg: 'Last name length must be greater than 3 and less than 30 characters.',
		});
	}
	// Username
	if (req.body.userName.length < 3 || req.body.userName.length > 30) {
		return res.status(500).json({
			input: 'userName',
			msg: 'Username length must be greater than 3 and less than 30 characters.',
		});
	}
	// Password
	if (req.body.password.length < 8 || req.body.password.length > 30) {
		return res.status(500).json({
			input: 'password',
			msg: 'Password length must be greater than 3 and less than 30 characters.',
		});
	}
	// Passwords Match
	if (req.body.password !== req.body.password2) {
		return res.status(500).json({
			input: 'password2',
			msg: 'Passwords do not match',
		});
	}

	// Check if the username is already exists or not
	User.findOne({ $or: [{ userName: req.body.userName }, { mobile: req.body.mobile }] }, (err, user) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else if (user) {
			return res.status(500).send('This username or phone number is already. Please take another one.');
		} else {
			const NEW_USER = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				userName: req.body.userName,
				sex: req.body.sex,
				mobile: req.body.mobile,
				password: req.body.password,
			});

			NEW_USER.save((err, user) => {
				if (err) {
					console.log(err);
					res.status(500).send('Some internal problem happened. Please try again.');
					return;
				} else {
					res.status(200).send('Your account created successfully.');
					return;
				}
			});
		}
	});
});

// Send login page
router.get('/login', (req, res) => {
	res.render('pages/login.ejs');
});

// Request for login
router.post('/login', (req, res) => {
	// Check for empty fields
	if (!req.body.userName || !req.body.password) {
		return res.status(500).json({
			msg: 'Empty fields not allowed',
		});
	}
	// Find user
	User.findOne({ userName: req.body.userName }, (err, user) => {
		if (err) {
			return res.status(500).json({
				msg: 'There is not such a username. Please try again.',
			});
		} else if (user) {
			if (req.body.password === user.password) {
				res.render('pages/dashboard.ejs', {
					user: user,
				});
			}
		} else {
			res.status(500).redirect('/login');
		}
	});
});

module.exports = router;
