"use strict";

var _ = require('lodash');

exports.isLoggedIn = function (req, res, next) {
	if (req.session.user) {
		return next();
	}
	res.status(401).send('Un Authorized');
};

exports.isAdmin = function (req, res, next) {
	var userRoles = require('../lib/enums/user-roles');
	var user = req.session.user;
	if (!user || (user.roles.indexOf(userRoles.ADMIN) === -1)) {
		return res.status(401).send('Un Authorized');
	}
	next();
};

exports.isCrew = function (req, res, next) {
	var userRoles = require('../lib/enums/user-roles');
	var user = req.session.user;

	if (user.role !== userRoles.CREW) {
		return res.status(401).send('Un Authorized');
	}
	next();
};

exports.hasRole = function (roles) {
	if (!_.isArray(roles)) {
		roles = [roles];
	}
	return function (req, res, next) {
		var user = req.session.user;

		if (_.has(roles, user.role)) {
			return res.status(401).send('Un Authorized');
		}
		next();
	};
};
