'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    schemaTypes = require('../utils/schema-types'),
    modelReferences = require('../utils/model-references'),
    moment = require('moment'),
    Schema = mongoose.Schema;

/**
 * Opportunity Schema
 */
var OpportunitySchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill Opportunity title',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    project: modelReferences.MOVIE,
    requiredRoles: [
        {type : String}
    ],
    location: schemaTypes.STRING,
    summary: schemaTypes.STRING,
    validUpto: {
        type: Date,
        default: moment().add('3', 'months').toDate
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

mongoose.model('Opportunity', OpportunitySchema);
