'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Genre Schema
 */
var GenreSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill Genre name',
		trim: true,
        unique : true
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	lastUpdatedDate: {
		type: Date,
		default: Date.now
	},
	lastUpdatedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Genre', GenreSchema);
