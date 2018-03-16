const express = require('express');
const router = express.Router();
const validator = require('validator');
const User = require('../models/user');
const ErrorReport = require('../models/errorReport');

// courses
router.get('/courses', loggedIn, (req, res, next) => {
	User.findOne({
		name: req.session.user.name
	}).then(found => {
		if (found) {
			res.status(200).json({
				courses: found.courses
			});
		} else {
			res.status(500).json({
				error: 'Serverfehler'
			});
			console.log(req.session);
		}
	});
});

router.post('/courses', loggedIn, (req, res, next) => {
	User.findOneAndUpdate({
		name: req.session.user.name
	}, {
		courses: req.body.courses,
		setupCompleted: true
	}).then(result => {
		if (result) {
			req.session.user.setupCompleted = true;
			res.status(202).json({
				message: 'Erfolgreich gespeichert'
			});
		} else {
			res.status(500).json({
				error: 'Serverfehler'
			});
			console.log(req.session);
		}
	});
});

// feedback
router.post('/feedback', loggedIn, (req, res, next) => {
	if (!req.body.title) {
		res.status(400).json({
			error: 'Titel fehlt'
		});
		return;
	}
	if (!req.body.category) {
		res.status(400).json({
			error: 'Kategorie fehlt'
		});
		return;
	}
	if (!req.body.content) {
		res.status(400).json({
			error: 'Inhalt fehlt'
		});
		return;
	}
	
	ErrorReport.create({
		title: req.body.title,
		category: req.body.category,
		content: req.body.content,
		author: req.session.user.name
	}).then(created => {
		res.status(201).json({
			message: 'Danke für dein Feedback!'
		});
	});

});

function loggedIn(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.status(401).json({
			error: 'Nicht authorisiert'
		});	
	}
};

module.exports = router;