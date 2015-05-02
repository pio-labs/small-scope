'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var movies = require('../../app/controllers/movies.server.controller');

	// Movies Routes
	app.route('/movies')
		.get(movies.list)
		.post(movies.create);

	app.route('/movies/:movieId')
		.get(movies.read)
		.put(users.requiresLogin, movies.hasAuthorization, movies.update)
		.delete(users.requiresLogin, movies.hasAuthorization, movies.delete);

    app.route('/api/movies/metadata')
        .get(movies.metaIfo)
        .post(movies.metaIfo);

	// Finish by binding the Movie middleware
	app.param('movieId', movies.movieByID);

};
