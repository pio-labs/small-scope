'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./movies/movies.crud.server.controller'),
	require('./movies/movies.crew.server.controller')
);