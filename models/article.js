const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	images: {
		type: String,
	},
	comments: {},
	likes: {},
});

module.exports = mongoose.model('Article', ArticleSchema);
