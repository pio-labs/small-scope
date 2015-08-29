'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaTypes = require('../utils/schema-types'),
    modelReferences = require('../utils/model-references'),
    _ = require('lodash'),
    movieStates = require('../lib/enums/movie-states');

var MovieCrewSchema = new Schema({
    role: schemaTypes.STRING,
    name: schemaTypes.STRING,
    //user: modelReferences.USER,
    rolePriority: schemaTypes.NUMBER
});

var MovieSchema = new Schema({
    title: schemaTypes.STRING,
    description: schemaTypes.STRING,
    user: modelReferences.USER,

    code :{
        type : String,
        unique : true,
        lowercase : true
    },

    languages: [schemaTypes.STRING],
    genres: [schemaTypes.STRING],

    releaseDate : schemaTypes.OPTIONAL_DATE,

    crew: [MovieCrewSchema],

    awards: [schemaTypes.OPTIONAL_STRING],
    recognitions: [schemaTypes.OPTIONAL_STRING],
    upVotes: schemaTypes.NUMBER,
    downVotes: schemaTypes.NUMBER,
    viewCount: schemaTypes.NUMBER,
    youtubeUrl: schemaTypes.OPTIONAL_STRING,
    facebook_url: {type: String},
    youtubeDetails: {},
    youtube_details: {},
    tags : [String],

    status: _.defaults({enum: movieStates.getAll()}, schemaTypes.OPTIONAL_STRING),


    approved: schemaTypes.BOOLEAN,
    approvedBy : {
        user: modelReferences.USER,
        date: schemaTypes.OPTIONAL_DATE
    },

    // Who fields
    created: {
        user: modelReferences.USER,
        date: schemaTypes.DATE
    },
    updated: {
        user: modelReferences.USER,
        date: schemaTypes.OPTIONAL_DATE
    },

    deleted: schemaTypes.BOOLEAN,
    deletedBy: {
        user: modelReferences.USER,
        date: schemaTypes.OPTIONAL_DATE
    }
});

mongoose.model('Movie', MovieSchema);