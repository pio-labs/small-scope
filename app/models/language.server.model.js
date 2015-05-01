'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Language Schema
 */
var LanguageSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Language name',
		trim: true
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

mongoose.model('Language', LanguageSchema);
