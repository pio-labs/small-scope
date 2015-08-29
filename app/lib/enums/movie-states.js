'use strict';

var Enum = require('./enum');

module.exports = new Enum({
	PLANNING: 'Planning',
	PRE_PRODUCTION: 'Pre Production',
	PRODUCTION: 'Production',
	POST_PRODUCTION: 'Post Production',
	COMPLETED: 'Completed'
});