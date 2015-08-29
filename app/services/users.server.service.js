"use strict";

var User = require('mongoose').model('User'),
	moment = require('moment'),
	_ = require('lodash'),
	userRoles = require('../lib/enums/user-roles');

exports.getUserById = function (userId, callback) {
	User.findById(userId, callback);
};

exports.findUsers = function (params, callback) {
	var promise = User.find(params.query);

	if (params.limit) {
		promise = promise.limit(params.limit);
	}

	if (params.offset) {
		promise = promise.skip(params.offset);
	}

	// we can return promise if callback is not passed
	return promise.exec(callback);
};

exports.createUser = function (currentUser, userRecord, callback) {
	// Will remove this check once login is implemented

	userRecord.created = {
		user: currentUser._id,
		date: moment()
	};

	userRecord.username = userRecord.email;
	userRecord.role = userRoles.VIEWER;
	User.create(userRecord, callback);
};


exports.updateUser = function (loggedInUser, userId, newDetails, callback) {
	return User.findById(userId).exec(function (err, user) {
		if (err) {
			return callback(err);
		}
		if (!user) {
			return callback(new Error('User not found'));
		}

		newDetails = User.filterUpdatableFieldsFromUserRecord(newDetails);
		newDetails.updated = {
			user: loggedInUser._id,
			date: moment()
		};

		_.each(newDetails, function (value, key) {
			// Remember to call markModified if we are modifying any property of no type (say '{}')
			user[key] = value;
		});

		user.save(callback);
	});
};

exports.deleteUser = function (loggedInUser, userId, callback) {
	User.findById(userId).exec(function (err, user) {
		if (err) {
			return callback(err);
		}
		if (!user) {
			return callback(new Error('User not found'));
		}
		user.deleted = true;
		user.deletedBy = {
			user: loggedInUser.id,
			date: moment()
		};
		user.save(callback);
	});
};

exports.isUserAuthenticated = function (email, password, callback) {
	User.findOne({email: email})
		.exec(function(err, user){
			if(err){
				return callback(err);
			}

			if (!user.authenticate(password)) {
				// If u can make a map of exceptions that can be passed
				return callback(null, false);
			}

			return callback(null, true, user);
		});
};

exports.registerUser = function (userRecord, callback) {
	User.create(userRecord, callback);
};