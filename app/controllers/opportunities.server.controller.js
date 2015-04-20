'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Opportunity = mongoose.model('Opportunity'),
	_ = require('lodash');

/**
 * Create a Opportunity
 */
exports.create = function(req, res) {
	var opportunity = new Opportunity(req.body);
	opportunity.user = req.user;

	opportunity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(opportunity);
		}
	});
};

/**
 * Show the current Opportunity
 */
exports.read = function(req, res) {
	res.jsonp(req.opportunity);
};

/**
 * Update a Opportunity
 */
exports.update = function(req, res) {
	var opportunity = req.opportunity ;

	opportunity = _.extend(opportunity , req.body);

	opportunity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(opportunity);
		}
	});
};

/**
 * Delete an Opportunity
 */
exports.delete = function(req, res) {
	var opportunity = req.opportunity ;

	opportunity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(opportunity);
		}
	});
};

/**
 * List of Opportunities
 */
exports.list = function(req, res) { 
	Opportunity.find().sort('-created').populate('user', 'displayName').exec(function(err, opportunities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(opportunities);
		}
	});
};

/**
 * Opportunity middleware
 */
exports.opportunityByID = function(req, res, next, id) { 
	Opportunity.findById(id).populate('user', 'displayName').populate('roles', 'name').exec(function(err, opportunity) {
		if (err) return next(err);
		if (! opportunity) return next(new Error('Failed to load Opportunity ' + id));
		req.opportunity = opportunity ;
		next();
	});
};

/**
 * Opportunity authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.opportunity.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
