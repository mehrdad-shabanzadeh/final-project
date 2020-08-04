const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

// For hash the passwords
// const { hashPassword, comparePasswords } = require('../tools/hashPassword');

// *******************************************************************************************************
// *******************************************************************************************************
// Get dashboard page
router.get('/dashboardAdmin', (req, res) => {
	User.find({ role: { $ne: 'admin' } })
		.then((bloggers) => {
			res.render('pages/dashboardAdmin.ejs', { admin: req.session.user, bloggers: bloggers });
		})
		.catch((err) => {
			return res.status(500).send('Something went wrong!');
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Get each blogger info
router.get('/bloggers/:id', (req, res) => {
	User.findById(req.params.id)
		.then((blogger) => {
			Article.find({ author: blogger._id })
				.then((articles) => {
					return res.render('pages/admin/bloggerInfo.ejs', { admin: req.session.user, blogger: blogger, articles: articles });
				})
				.catch((err) => {
					return res.status(500).send('Something went wrong!');
				});
		})
		.catch((err) => {
			return res.status(500).send('Something went wrong!');
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Reset password
router.post('/resetPassword', (req, res) => {
	User.findById(req.body.id)
		.then((blogger) => {
			bcrypt
				.hash(blogger.mobile, 10)
				.then((hash) => {
					User.findByIdAndUpdate(blogger._id, { password: hash }).then((blogger) => {
						return res.status(200).send('Password set to mobile number.');
					});
				})
				.catch((err) => {
					return res.status(500).send('Something went wrong!');
				});
		})
		.catch((err) => {
			return res.status(500).send('Something went wrong!');
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Remove a blogger
router.post('/removeBlogger', (req, res) => {
	User.findByIdAndRemove(req.body.id)
		.then((blogger) => {
			return res.status(200).send('Blogger removed successfully');
		})
		.catch((err) => {
			return res.status(500).send('Something went wrong!');
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Article info
router.get('/articleInfo/:id', (req, res) => {
	Article.findById(req.params.id)
		.populate('author', 'firstName lastName')
		.exec((err, article) => {
			if (err) {
				return res.status(500).send('Something went wrong!');
			} else {
				Comment.find({ article: req.params.id })
					.populate('name', 'firstName lastName')
					.exec((err, comments) => {
						if (err) {
							return res.status(500).send('Something went wrong!');
						} else {
							res.render('pages/admin/articleInfo.ejs', { admin: req.session.user, article: article, comments: comments });
						}
					});
			}
		});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Remove article
router.post('/removeArticle/:id', (req, res) => {
	Article.findByIdAndRemove(req.params.id, (err, article) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			return res.status(200).send('Article deleted successfully.');
		}
	});
});

// *******************************************************************************************************
// *******************************************************************************************************
// Remove comment
router.post('/removeComment/:id', (req, res) => {
	Comment.findByIdAndRemove(req.params.id, (err, comment) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			return res.status(200).send('Comment deleted successfully.');
		}
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
