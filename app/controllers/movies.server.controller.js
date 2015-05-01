'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    youtubeService = require('../services/youtube-service'),
    Movie = mongoose.model('Movie'),
    Genre = mongoose.model('Genre'),
    Language=mongoose.model('Language'),
    _ = require('lodash'),
    async = require('async');


/**
 * Create a Movie
 */
exports.create = function (req, res, next) {
    var movie = new Movie(req.body);
    movie.user = req.user;
    youtubeService.getYoutubeDetailsFromUrl(movie.youtube_url, function (youtubeDetails, err) {
        if (err) {
            return next(err);
        }

        movie.youtube_details = youtubeDetails;
        console.log(youtubeDetails);
        movie.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(movie);
            }
        });
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

    movie.remove(function (err) {
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
    Movie.findById(id).populate('user', 'displayName').exec(function (err, movie) {
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


 exports.metaIfo=function(req,res){

     async.parallel(
         {
             genres : function(callback){
                 Genre.find().sort('-displayName').populate('createdBy lastUpdatedBy', 'displayName').exec(callback);
             },
             languages : function(callback){
                 Language.find().sort('-displayName').populate('createdBy lastUpdatedBy', 'displayName').exec(callback);
             }
         },function(err, result){

            res.jsonp({
                genres : result.genres,
                languages : result.languages
            });
     });
 };
