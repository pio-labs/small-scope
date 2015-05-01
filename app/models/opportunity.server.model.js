'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Opportunity Schema
 */
var OpportunitySchema = new Schema({
    title: {
	   type: String,
	   default: '',
	   required: 'Please fill Opportunity name',
	   trim: true
    },
    created: {
	   type: Date,
	   default: Date.now
    },
    user: {
	   type: Schema.ObjectId,
	   ref: 'User'
    },
    description: {
	   type: String,
	   trim: true,
	   required: 'Please fill Opportunity description'
    },
    roles:[{
	   type: Schema.ObjectId,
	   ref: 'Role'
    }],
    contact_person:{
	   type: String
    },
    phone:{
	   type: String
    },
    location:{
	   type: String
    },
    email:{
	   type: String
    },
    website: {
	   type: String
    }
});

mongoose.model('Opportunity', OpportunitySchema);