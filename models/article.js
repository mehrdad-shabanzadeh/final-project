const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	summary: {
		type: String,
		maxlength: 200,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	image: {
		type: String,
		// default: 'defaultArticleImage.png',
	},
});

module.exports = mongoose.model('Article', ArticleSchema);
