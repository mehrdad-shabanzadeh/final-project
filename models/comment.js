const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	message: {
		type: String,
	},
	name: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	article: {
		type: Schema.Types.ObjectId,
		ref: 'Article',
		required: true,
	},
});

module.exports = mongoose.model('Comment', CommentSchema);
