'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	schemaTypes = require('../utils/schema-types'),
	modelReferences = require('../utils/model-references');

var VoteSchema = new Schema({
	user: modelReferences.USER,
	movie: modelReferences.MOVIE,
	vote: schemaTypes.NUMBER, // upVote -> 1 downVote -> -1
	date: schemaTypes.DATE
});

mongoose.model('MovieVote', VoteSchema);
