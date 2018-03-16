const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name required']
	},
	searchName: {
		type: String,
		required: [true, 'SearchName required']
	},
	email: {
		type: String,
		required: [true, 'Email required']
	},
	passwordHash: {
		type: String,
		required: [true, 'Password required']
	},
	setupCompleted: {
		type: Boolean,
		default: false
	},
	courses: {
		type: Array,
		default: []
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;