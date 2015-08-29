'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Movie = mongoose.model('Movie');

exports.updateCrew = function (req, res, next) {
	var movie = req.movie;
	if (!movie) {
		return next(new Error('Movie not found'));
	}

	// can validate the user list
	var crew = req.body;

	// Ideally we should get the user references and add the crew
	// but, currently we shall just store the name of the person
	movie.crew = (movie.crew || []).concat(crew);
	movie.save(function(err){
		if(err){
			return next(err);
		}
		res.json();
	});
};

exports.deleteCrew = function (req, res, next) {
	var movie = req.movie;
	if (!movie) {
		return next(new Error('Movie not found'));
	}

	// currently array of names, will be changed to ids
	var crewToBeDeleted = req.body || [];
	movie.crew = _.filter(movie.crew, function(crew){
		return crewToBeDeleted.indexOf(crew.name);
	});

	movie.save(function(err){
		if(err){
			return next(err);
		}
		res.json();
	});
};

exports.getCrew = function (req, res, next) {
	if (!req.movie) {
		return next(new Error('Movie not found'));
	}
	res.send(req.movie.crew);
};
