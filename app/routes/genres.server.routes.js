'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var genres = require('../../app/controllers/genres.server.controller');

	// Genres Routes
	app.route('/api/genres')
		.get(genres.list)
		.post(users.requiresLogin, genres.create);

	app.route('/api/genres/:genreId')
		.get(genres.read)
		.put(users.requiresLogin, genres.hasAuthorization, genres.update)
		.delete(users.requiresLogin, genres.hasAuthorization, genres.delete);

	// Finish by binding the Genre middleware
	app.param('genreId', genres.genreByID);
};
