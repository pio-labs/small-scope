'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Movie Schema
 */
var MovieSchema = new Schema({

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    code :{
        type : String,
        unique : true,
        lowercase : true
    },
    title: {type: String, required: true},
    language: {type: String, required: true},
    genre: {type: String, required: true},
    release_date: {type: Date},
    story_line: {type: String},
    cast: [String],
    director: [String],
    writer:  [String],
    dialogues: [String],
    screen_play: [String],
    music: [String],
    editing: [String],
    effects: [String],
    producer: [String],
    cinematography: [String],
    production_house: [String],
    awards: [String],
    recognitions: [String],
    up_votes: {type: Number, default: 0},
    down_votes: {type: Number, default: 0},
    view_count: {type: Number, default: 0},
    youtube_url: {type: String, unique : true},
    facebook_url: {type: String},
    youtube_details: {},
    tags : [String]
});

mongoose.model('Movie', MovieSchema);
