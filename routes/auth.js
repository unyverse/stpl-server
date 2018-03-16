const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator');

// login
router.post('/login', (req, res, next) => {
	User.findOne({
		searchName: req.body.username.toLowerCase()
	}).then(found => {
		if (found) {
			bcrypt.compare(req.body.password, found.passwordHash).then(result => {
				if (result) {
					let data = {
						setupCompleted: found.setupCompleted,
						name: found.name,
						email: found.email,
						courses: found.courses
					};
					req.session.user = data;
					if (found.name === 'malte') {
						req.session.admin = true;
					}
					res.status(200).json(data);
				} else {
					res.status(401).json({
						error: 'Benutzername oder Passwort falsch'
					});
				}
			});
		} else {
			res.status(401).json({
				error: 'Benutzername oder Passwort falsch'
			});
		}
	});
});

// register
router.post('/register', (req, res, next) => {
	if (!req.body.username || !validator.isAlphanumeric(req.body.username)) {
		res.status(400).json({
			error: 'Benutzername ungültig'
		});
		return;
	}
	if (!req.body.email || !validator.isEmail(req.body.email)) {
		res.status(400).json({
			error: 'E-Mail ungültig'
		});
		return;
	}
	if (!req.body.password || !validator.isLength(req.body.password, { min: 6 })) {
		res.status(400).json({
			error: 'Passwort muss min. 6 Zeichen lang sein'
		});
		return;
	}
	User.findOne({
		searchName: req.body.username.toLowerCase()
	}).then(found => {
		if (found) {
			res.status(422).json({
				error: 'Benutzername wird bereits verwendet'
			});
		} else {
			bcrypt.hash(req.body.password, 10).then((hash, err) => {
				if (err) {
					console.log(err);
				} else {
					User.create({
						name: req.body.username,
						searchName: req.body.username.toLowerCase(),
						email: req.body.email,
						passwordHash: hash
					}).then(created => {
						console.log(created);
						let data = {
							setupCompleted: created.setupCompleted,
							name: created.name,
							email: created.email
						};
						req.session.user = data;
						res.status(201).json(data);
					});
				}
			});
		}
	});
});

router.get('/logout', (req, res, next) => {
	req.session = null;
	res.status(200).json({
		message: 'Erfolgreich abgemeldet'
	});
});

module.exports = router;