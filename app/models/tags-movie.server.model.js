'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Genre Schema
 */
var TagsSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill Tag name',
		trim: true,
        unique : true,
        lowercase: true
	}
});

mongoose.model('Tag', TagsSchema);
