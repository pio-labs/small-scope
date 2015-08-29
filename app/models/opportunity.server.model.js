'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaTypes = require('../utils/schema-types'),
    modelReferences = require('../utils/model-references'),
    _ = require('lodash'),
    movieStates = require('../lib/enums/movie-states');

var MovieCrewSchema = new Schema({
    role: schemaTypes.STRING,
    rolePriority: schemaTypes.NUMBER,
    user: modelReferences.USER
});

var MovieSchema = new Schema({
    title: schemaTypes.STRING,
    description: schemaTypes.STRING,

    code :{
        type : String,
        unique : true,
        lowercase : true
    },

    languages: [schemaTypes.STRING],
    genres: [schemaTypes.STRING],

    release_date : schemaTypes.OPTIONAL_DATE,

    crew: [MovieCrewSchema],

    awards: [schemaTypes.OPTIONAL_STRING],
    recognitions: [schemaTypes.OPTIONAL_STRING],
    upVotes: schemaTypes.NUMBER,
    downVotes: schemaTypes.NUMBER,
    viewCount: schemaTypes.NUMBER,
    youtubeUrl: schemaTypes.OPTIONAL_STRING,
    facebook_url: {type: String},
    youtubeDetails: {},
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

mongoose.model('Opportunity', MovieSchema);