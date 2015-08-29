'use strict';

module.exports = function (app) {
	var users = require('../../app/controllers/users.server.controller');
	var movies = require('../../app/controllers/movies.server.controller');

	// Movies Routes
	app.route('/movies')
		.get(movies.list)
		.post(users.requiresLogin, movies.create);

	app.route('/movies/:movieId')
		.get(movies.read)
		.put(users.requiresLogin, movies.hasAuthorization, movies.update)
		.delete(users.requiresLogin, movies.hasAuthorization, movies.delete);

	app.route('/movies/:movieId/crew')
		.get(movies.getCrew)
		.post(users.requiresLogin, movies.hasAuthorization, movies.updateCrew)
		.delete(users.requiresLogin, movies.hasAuthorization, movies.deleteCrew);

	app.route('/api/movies/fields')
		.get(movies.metaInfo);

	app.route('/api/movies/:movieId/votes')
		.get(movies.getUserVote)
		.put(users.requiresLogin, movies.voteMovie);

	// Finish by binding the Movie middleware
	app.param('movieId', movies.movieByID);

};
