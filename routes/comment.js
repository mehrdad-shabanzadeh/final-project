const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

// *******************************************************************************************************
// *******************************************************************************************************
// If anyone requested for /api/comments will be redirected to / route
router.get('/', (req, res) => {
	return res.redirect('/');
});

// *******************************************************************************************************
// *******************************************************************************************************
// Add comments
router.post('/addComment/:id', (req, res) => {
	newComment = new Comment({
		message: req.body.message,
		name: req.session.user._id,
		article: req.params.id,
	});

	newComment.save((err, comment) => {
		if (err) {
			return res.status(500).send('Something went wrong!');
		} else {
			return res.redirect(`/${req.params.id}`);
		}
	});
});

module.exports = router;
