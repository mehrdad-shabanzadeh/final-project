const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

// For hash the passwords
// const { hashPassword, comparePasswords } = require('../tools/hashPassword');

// *******************************************************************************************************
// *******************************************************************************************************
// Get dashboard page
router.get('/dashboard', (req, res) => {
	User.findById({ _id: req.session.user._id }, (err, blogger) => {
		if (err) return res.status(500).send('Something went wrong!');

		if (!blogger) return res.status(500).send('Something went wrong!');

		Article.find({ author: req.session.user._id }, (err, articles) => {
			if (err) {
				return res.status(500).send('Something went wrong!');
			} else {
				res.render('pages/dashboard.ejs', { user: blogger, articles: articles });
			}
		});
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Get edit profile page
router.get('/editProfile', (req, res) => {
	User.findById({ _id: req.session.user._id }, (err, blogger) => {
		if (err) return res.status(500).send('Something went wrong!');

		if (!blogger) return res.status(500).send('Something went wrong!');

		res.render('pages/editProfile.ejs', { user: blogger });
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Edit profile process
router.post('/editProfile', (req, res) => {
	User.findOneAndUpdate(req.session.user._id, { $set: req.body }, { new: true }, (err, blogger) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			res.status(200).send('Your profile updated successfully');
		}
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Change password

// Check for change password request
router.post('/changePasswordPage', (req, res) => {
	User.findById({ _id: req.session.user._id }, (err, blogger) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			bcrypt
				.compare(req.body.password, blogger.password)
				.then((result) => {
					if (result) {
						return res.status(200).send('done');
					} else {
						return res.status(500).send('Your password is wrong. Please try again!');
					}
				})
				.catch((err) => {
					console.log('user_line76: ' + err);
					return res.status(500).send('Something went wrong!');
				});
		}
	});
});

// Send change password page
router.get('/changePasswordPage', (req, res) => {
	res.render('pages/changePassword.ejs', { user: req.session.user });
});

// Change password process
router.post('/changePassword', (req, res) => {
	// Check for empty fields
	if (!req.body.password || !req.body.password2) {
		return res.status(500).send('Empty fields are not allowed!');
	}
	// Check for passwords match
	if (req.body.password !== req.body.password2) {
		return res.status(500).send('Passwords do not match');
	}
	// Updating process in db
	User.findByIdAndUpdate({ _id: req.session.user._id }, { $set: { password: req.body.password } }, (err, blogger) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					blogger.password = hash;
					blogger.save((err, user) => {
						if (err) {
							return res.status(500).send('Some internal problem happened. Please try again.');
						} else {
							return res.status(200).send('done');
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
// UPLOAD IMAGE

// Configure the multer for image uploading
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	},
});

const upload = multer({ storage: storage }).single('avatar');

// Add avatar
router.post('/uploadAvatar', (req, res) => {
	upload(req, res, (err) => {
		if (err) return res.status(500).send('Something went wrong!');

		if (!req.file) return res.status(500).send('No file Selected!');

		User.findByIdAndUpdate({ _id: req.session.user._id }, { avatar: req.file.filename }, { new: true }, (err, blogger) => {
			if (err) return res.status(500).send('Something went wrong!');
			// if blogger has image, first delete that
			try {
				if (req.session.user.avatar) fs.unlinkSync(`public/uploads/${req.session.user.avatar}`);
			} catch (error) {
				if (error) return res.status(500).send('Something went wrong!');
			}
			return res.status(200).send('Your image uploaded successfully.');
		});
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Logout process
router.get('/logout', (req, res) => {
	req.session = null;
	res.clearCookie('user_sid');
	res.status(200).send('You logged out successfully.');
});

module.exports = router;
