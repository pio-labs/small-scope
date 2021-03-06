'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};

exports.getAll = function (req, res, next) {
	User.find({}).select('displayName').find(function (err, users) {
		if (err) {
			return next(err);
		}
		res.json(users);
	});
};

exports.updatePreferences = function (req, res, next) {
	// Init Variables
	var user = req.user;

	// For security measurement we remove the roles from the req.body object
	var preferenceUpdates = {
		genres: req.body.genres,
		languages: req.body.languages,
		like_documentaries: req.body.like_documentaries
	};

	if (user) {
		user.preferences = preferenceUpdates;
		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.json(user);
		});
	}
};

exports.getUserById = function (req, res, next) {
	User.findById(req.params.userId).exec(function(err, user){
		if(err){
			return next(err);
		}
		res.json(user.getPublicDetails());
	});
};
