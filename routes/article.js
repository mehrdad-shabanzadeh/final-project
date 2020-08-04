const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

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
		summary: req.body.body.substring(0, 197) + '...',
		// date: req.body.date,
		image: 'defaultArticleImage.png',
	});
	newArticle.save((err, article) => {
		if (err) {
			console.log(err);
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			return res.status(200).send('Your article saved successfully.');
		}
	});
});

// ************************************************************************************
// ************************************************************************************
// Edit article

// Send article for edit
router.get('/editArticle/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			return res.render('pages/editArticle.ejs', { article: article, user: req.session.user });
		}
	});
});

// Save changes
router.post('/editArticle/:id', (req, res) => {
	Article.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title: req.body.title,
				body: req.body.body,
				summary: req.body.body.substring(0, 197) + '...',
			},
		},
		{ new: true },
		(err, article) => {
			if (err) {
				return res.status(500).send('Some internal problem happened. Please try again.');
			} else {
				return res.status(200).send('Your changes saved successfully.');
			}
		}
	);
});

// ************************************************************************************
// ************************************************************************************
// Delete article
router.delete('/deleteArticle/:id', (req, res) => {
	Article.findByIdAndDelete(req.params.id, (err, article) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			return res.status(200).send(`The article "${article.title}" deleted successfully.`);
		}
	});
});

// ************************************************************************************
// ************************************************************************************
// Go to read more page
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) {
			return res.status(500).send('Some internal problem happened. Please try again.');
		} else {
			Comment.find({ article: req.params.id })
				.populate('name', 'firstName lastName')
				.exec((err, comments) => {
					if (err) {
						return res.status(500).send('Something went wrong!');
					} else {
						res.render('pages/readMore.ejs', { article: article, comments: comments, user: req.session.user });
					}
				});
		}
	});
});

// ************************************************************************************
// ************************************************************************************

module.exports = router;
