'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

var createGenreList = function(){
    var Genre = mongoose.model('Genre');
    var genres = require('./data/genres.json');
    var createGenre = function(){

    };

    var tasks = _.map(genres, function(genre){
        return function(cb){

            genre.code =
            Genre.findOne({code: genre.code}).exec(function(err, genre){
                if(err){
                    console.error('Error while creating Genres');
                }
                if(genre){
                    return cb();
                }

                createGenre(genre, cb);
            });

        };
    });

};

/**
 * Execute a list of tasks that are to be executed on db connection
 */
(function run(){
    createGenreList();
})();