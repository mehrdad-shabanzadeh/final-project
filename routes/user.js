const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

// Get dashboard page
router.get('/dashboard', (req, res) => {
	// console.log(req.session.user);
	Article.find({ author: req.session.user._id }, (err, articles) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			res.render('pages/dashboard.ejs', { user: req.session.user, articles: articles });
		}
	});
});

// Get edit profile page
router.get('/editProfile', (req, res) => {
	res.render('pages/editProfile.ejs', { user: req.session.user });
});

// Edit profile process
router.post('/editProfile', (req, res) => {
	User.findOneAndUpdate({ _id: req.session.user._id }, req.body, { new: true }, (err, blogger) => {
		if (err) {
			console.log(err);
		} else {
			res.status(200).send('done');
		}
	});
});

// Add avatar
router.post('/uploadAvatar', (req, res) => {
	//
});

// Get add article page
router.get('/addArticle', (req, res) => {
	res.render('pages/addArticle.ejs', { user: req.session.user });
});

// Add new article process
router.post('/addArticle', (req, res) => {
	if (!req.body.title || !req.body.body) {
		return res.status(500).send('Empty fields are not allowed!');
	}
	const newArticle = new Article({
		title: req.body.title,
		author: req.session.user._id,
		body: req.body.body,
		// date: req.body.date,
	});
	newArticle.save((err, article) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			return res.status(200).send('Your article saved successfully.');
		}
	});
});

// Logout process
router.get('/logout', (req, res) => {
	req.session = null;
	res.clearCookie('user_sid');
	res.status(200).send('You logged out successfully.');
});

module.exports = router;
