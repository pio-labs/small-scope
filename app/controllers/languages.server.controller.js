'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Language = mongoose.model('Language'),
	_ = require('lodash'),
    commonUtil=require("../util/common.server.util");
/**
 * Create a Language
 */
exports.create = function(req, res) {
	var language = new Language(req.body);
    commonUtil.addWhoFields(language,req.user);

	language.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(language);
		}
	});
};

/**
 * Show the current Language
 */
exports.read = function(req, res) {
	res.jsonp(req.language);
};

/**
 * Update a Language
 */
exports.update = function(req, res) {
	var language = req.language ;

	language = _.extend(language , req.body);

    commonUtil.addWhoFields(language,req.user);
	language.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(language);
		}
	});
};

/**
 * Delete an Language
 */
exports.delete = function(req, res) {
	var language = req.language ;

	language.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(language);
		}
	});
};

/**
 * List of Languages
 */
exports.list = function(req, res) { 
	Language.find().sort('-created').populate('createdBy lastUpdatedBy', 'displayName').exec(function(err, languages) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(languages);
		}
	});
};

/**
 * Language middleware
 */
exports.languageByID = function(req, res, next, id) { 
	Language.findById(id).populate('createdBy lastUpdatedBy', 'displayName').exec(function(err, language) {
		if (err) return next(err);
		if (! language) return next(new Error('Failed to load Language ' + id));
		req.language = language ;
		next();
	});
};

/**
 * Language authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.language.createdBy.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
