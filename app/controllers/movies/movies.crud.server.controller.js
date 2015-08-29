'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	async = require('async'),

	Movie = mongoose.model('Movie'),
	Genre = mongoose.model('Genre'),
	Language = mongoose.model('Language'),
	MovieVote = mongoose.model('MovieVote'),
	Tag = mongoose.model('Tag'),

	errorHandler = require('../errors.server.controller'),
	youtubeService = require('../../services/youtube-service'),
	movieStates = require('../../lib/enums/movie-states'),
	crewTypes = require('../../lib/enums/crew-type');

/**
 * Create a Movie
 */
exports.create = function (req, res, next) {
	var movie, tags = [];
	async.series({
		setup: function(callback){
			movie = new Movie(req.body);
			movie.created = {
				user: req.user,
				date: new Date().getTime()
			};
			movie.user = req.user;

			if (req.body.tags)
				movie.tags = req.body.tags.split(',');

			for (var i = 0; i < movie.tags.length; i++) {
				tags.push({name: movie.tags[i]});
			}
			callback()
		},
		setCode: function (callback) {
			var code = movie.title.replace(/[^A-Za-z0-9]+/g, '_');
			Movie.find({code: new RegExp('^' + code, 'i')}, function (err, result) {
				if (result) {
					code = code + result.length;
				}
				movie.code = code;
				callback(err, result);
			});
		},
		setYoutubeDetails: function (callback) {
			youtubeService.getYoutubeDetailsFromUrl(movie.youtubeUrl, function (err, details) {
				if (err) {
					return next(err);
				}
				movie.youtubeDetails = details;
				callback(err, details);
			});

		},
		movie: function (callback) {
			async.parallel({
				saveMovie: function (callback) {
					movie.save(function(err, result){
						callback(err, result);
					});
				},
				saveTags: function (callback) {
					Tag.create(tags, function (err, result) {
						callback(null, result);
					});
				}
			}, function (err, results) {
				if(err){
					console.error(err);
				}
				callback(err, results.saveMovie[0]);
			});
		}
	}, function (err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(results.movie);
	});
};

/**
 * Show the current Movie
 */
exports.read = function (req, res, next) {
	res.jsonp(req.movie);
};

/**
 * Update a Movie
 */
exports.update = function (req, res, next) {
	var movie = req.movie;

	movie = _.extend(movie, req.body);
	if(req.body.crew){
		movie.crew  = _.map(req.body.crew, function(crew){
			crew.user = crew.user._id;
			return crew
		});
	}

	movie.updated = {
		user: req.user,
		date: Date()
	};

	movie.save(function (err) {
		if (err) {

			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movie);
		}
	});
};

/**
 * Delete an Movie
 */
exports.delete = function (req, res, next) {
	var movie = req.movie;
	movie.deletedBy = {
		user: req.user,
		date: Date()
	};
	movie.deleted = true;
	movie.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movie);
		}
	});
};

/**
 * List of Movies
 */
exports.list = function (req, res, next) {
	Movie.find().sort('-created').populate('user', 'displayName').exec(function (err, movies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(movies);
		}
	});
};

/**
 * Movie middleware
 */
exports.movieByID = function (req, res, next, id) {
	Movie.findOne({_id: id, deleted: {$ne: true}}).populate('user', 'displayName').populate('crew.user', 'displayName').exec(function (err, movie) {
		if (err) return next(err);
		if (!movie) return next(new Error('Failed to load Movie ' + id));
		req.movie = movie;
		next();
	});
};

/**
 * Movie authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.movie.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Movie meta info like filters genres tags etc..
 * */

exports.metaInfo = function (req, res, next) {
	async.parallel(
		{
			genres: function (callback) {
				Genre.find().sort('-name').populate('createdBy updated.user', 'displayName').exec(callback);
			},
			languages: function (callback) {
				Language.find().sort('-name').populate('createdBy updated.user', 'displayName').exec(callback);
			},
			states: function (callback) {
				callback(null, movieStates.getAll());
			},
			tags: function (callback) {
				Tag.find().sort('-name').exec(callback);
			},
			crewTypes: function(callback){
				callback(null, crewTypes.getAll())
			}
		}, function (err, result) {
			if (err) {
				return next(err);
			}
			res.jsonp(result);
		});
};

exports.getMoviesOfUser = function (req, res, next) {
	Movie.find({"created.user": req.user._id}).select('title description tags youtubeDetails releaseDate').exec(function (err, movies) {
		if(err){
			return next(err);
		}
		res.json(movies);
	});
};

exports.getUserVote = function (req, res, next) {
	if(!req.user) return res.json();

	MovieVote.findOne({movie: req.movie._id, user: req.user._id}).sort({date: -1}).exec(function (err, record) {
		if (err) return next(err);
		if (!record) return res.json();

		res.json({vote: record.vote});
	});
};

exports.voteMovie = function(req, res, next) {
	var vote = req.body.vote;
	MovieVote.findOne({movie: req.movie._id, user: req.user._id}).sort({date: -1}).exec(function (err, record) {
		if (err) return next(err);
		if (!record) {
			record = new MovieVote({
				user: req.user._id,
				movie: req.movie._id,
				vote: vote
			});
		} else {
			if (record.vote == vote) {
				return res.send();
			}
			record.vote = vote;
			record.date = Date();
		}
		record.save(function (err) {
			if (err) return next(err);
			res.json();
		});
	});
};
