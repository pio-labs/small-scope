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
    Tag=mongoose.model('Tag'),
    _ = require('lodash'),
    async = require('async');


var validateMovieReq=function(req){
    req.assert('title', 'Title required').notEmpty();
    req.assert('language', 'Language required').notEmpty();
    req.assert('genre', 'Genre required').notEmpty();
    req.assert('youtube_url', 'Youtube Url required').notEmpty();
};
var processMovieRequest=function(req){
    if(typeof req.body.bodycast==='string'){
        req.body.cast=req.body.cast.split(',');
    }
    if(typeof req.body.director==='string'){
        req.body.director=req.body.director.split(',');
    }
    if(typeof req.body.writer==='string'){
        req.body.writer=req.body.writer.split(',');
    }
    if(typeof req.body.dialogues==='string'){
        req.body.dialogues=req.body.dialogues.split(',');
    }
    if(typeof req.body.screen_play==='string'){
        req.body.screen_play=req.body.screen_play.split(',');
    }
    if(typeof req.body.music==='string'){
        req.body.music=req.body.music.split(',');
    }
    if(typeof req.body.editing==='string'){
        req.body.editing=req.body.editing.split(',');
    }
    if(typeof req.body.effects==='string'){
        req.body.effects=req.body.effects.split(',');
    }
    if(typeof req.body.producer==='string'){
        req.body.producer=req.body.producer.split(',');
    }
    if(typeof req.body.cinematography==='string'){
        req.body.cinematography=req.body.cinematography.split(',');
    }
    if(typeof req.body.production_house==='string'){
        req.body.production_house=req.body.production_house.split(',');
    }
    if(typeof req.body.awards==='string'){
        req.body.awards=req.body.awards.split(',');
    }
    if(typeof req.body.recognitions==='string'){
        req.body.recognitions=req.body.recognitions.split(',');
    }
};

/**
 * Create a Movie
 */
exports.create = function (req, res, next) {
    validateMovieReq(req);
    var errors = req.validationErrors();
    if(errors){
        res.send({error : errors});
        return;
    }
    processMovieRequest(req);
    var movie = new Movie(req.body);

    console.log(movie);
    movie.user = req.user;
    var code=movie.title.replace(/[^A-Za-z0-9]+/g,'_');
    if(req.body.tags) movie.tags=req.body.tags.split(',' );
    var tags=[];
    for(var i=0;i<  movie.tags.length;i++ ){
        tags.push({name : movie.tags[i]});
    }
    async.series({
        setCode: function (callback) {
            Movie.find({code : new RegExp('^'+code,'i') }, function(err,result){
                if(result){
                    code =code+result.length;
                }
                movie.code=code;
                callback(err,result);
            });
        },

        setYoutubeDetails : function(callback){
            youtubeService.getYoutubeDetailsFromUrl(movie.youtube_url, function (youtubeDetails, err) {
                    if (err) {
                        return next(err);
                    }
                    movie.youtube_details = youtubeDetails;
                    callback(err,youtubeDetails);
            });

        } ,
        saveMovie : function(callback){
            async.parallel({
                saveMovie : function(callback){
                    movie.save( callback);
                },
                saveTags : function(callback){
                    Tag.create(tags, function (err,result) {
                        callback(undefined,result);
                    });
                }
            }, function (err, results) {
                console.log(err);
                callback(err, results.saveMovie);
            });
        }
    }, function(err, results){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.jsonp(results.saveMovie);
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
                 Genre.find().sort('-name').populate('createdBy lastUpdatedBy', 'displayName').exec(callback);
             },
             languages : function(callback){
                 Language.find().sort('-name').populate('createdBy lastUpdatedBy', 'displayName').exec(callback);
             },
             tags : function(callback){
                 Tag.find().sort('-name').exec(callback);
             }
         },function(err, result){

            res.jsonp({
                tags : result.tags,
                genres : result.genres,
                languages : result.languages
            });
     });
 };
