const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorReportSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Title required']
	},
	category: {
		type: String,
		required: [true, 'Category required']
	},
	content: {
		type: String,
		required: [true, 'Content required']
	},
	author: {
		type: String,
		required: [true, 'Author required']
	},
});

const ErrorReport = mongoose.model('ErrorReport', ErrorReportSchema);

module.exports = ErrorReport;