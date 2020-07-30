const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');

// ************************************************************************************
// ************************************************************************************
// Get add article page
router.get('/addArticle', (req, res) => {
	res.render('pages/addArticle.ejs', { user: req.session.user });
});

// ************************************************************************************
// ************************************************************************************
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

// ************************************************************************************
// ************************************************************************************
// Edit article
router.post('/editArticle/:id', (req, res) => {
	res.status(200).send('done');
});

// ************************************************************************************
// ************************************************************************************
// Delete article
router.delete('/deleteArticle/:id', (req, res) => {
	res.status(200).send('done');
});

// ************************************************************************************
// ************************************************************************************
// Go to read more page
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			return res.render('pages/readMore.ejs', { article: article, user: req.session.user });
		}
	});
});

// ************************************************************************************
// ************************************************************************************

module.exports = router;
