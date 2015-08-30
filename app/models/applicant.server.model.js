'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	modelReferences = require('../utils/model-references'),
	Schema = mongoose.Schema;

/**
 * Applicant Schema
 */
var ApplicantSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	applicant: modelReferences.USER,
	opportunity : modelReferences.OPPORTUNITY,
	movie: modelReferences.MOVIE
});

mongoose.model('Applicant', ApplicantSchema);