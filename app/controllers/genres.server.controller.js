'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Genre = mongoose.model('Genre'),
	_ = require('lodash'),
    commonUtil=require("../util/common.server.util");

/**
 * Create a Genre
 */
exports.create = function(req, res) {

	var genre = new Genre(req.body);
	commonUtil.addWhoFields(genre,req.user);
	genre.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genre);
		}
	});
};

/**
 * Show the current Genre
 */
exports.read = function(req, res) {
	res.jsonp(req.genre);
};

/**
 * Update a Genre
 */
exports.update = function(req, res) {
	var genre = req.genre ;

	genre = _.extend(genre , req.body);
    commonUtil.addWhoFields(genre,req.user);
	genre.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genre);
		}
	});
};

/**
 * Delete an Genre
 */
exports.delete = function(req, res) {
	var genre = req.genre ;

	genre.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genre);
		}
	});
};

/**
 * List of Genres
 */
exports.list = function(req, res) {
	Genre.find().sort('-created').populate('createdBy lastUpdatedBy', 'displayName').exec(function(err, genres) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genres);
		}
	});
};

/**
 * Genre middleware
 */
exports.genreByID = function(req, res, next, id) { 
	Genre.findById(id).populate('createdBy lastUpdatedBy', 'displayName').exec(function(err, genre) {
		if (err) return next(err);
		if (! genre) return next(new Error('Failed to load Genre ' + id));
		req.genre = genre ;
		next();
	});
};

/**
 * Genre authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.genre.createdBy.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
