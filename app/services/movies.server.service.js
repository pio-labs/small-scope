"use strict";

var Movie = require('mongoose').model('Movie');
_ = require('lodash');

module.exports =
{
	getMovies: function (callBack) {
		Movie.find({}, callBack);
	},
	getMovie: function (id, callBack) {
		Movie.findById(id, callBack);
	},
	addMovie: function (movie, user, callBack) {
		movie = new Movie(movie);
		movie.created.user = user.id;
		movie.created.date = Date();
		movie.updated.user = user.id;
		movie.updated.date = Date();
		movie.save(callBack);
	},
	updateMovie: function (id, movie, user, callBack) {
		Movie.findById(id, function (err, res) {
			if (err) {
				return callBack(err);
			}
			movie = _.extend(res, movie);
			movie.updated.user = user.id;
			movie.updated.date = Date();
			movie.save(callBack);
		});
	}
};