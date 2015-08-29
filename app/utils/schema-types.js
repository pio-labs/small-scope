'use strict';

var Schema = require('mongoose').Schema,
	validate = require('mongoose-validator');

// Validators.
var stringValidator = validate({
	message: 'Should be a non empty string',
	validator: 'isLength',
	arguments: [1]
});
var optionalStringValidator = validate({
	message: 'Should be a non empty string',
	validator: 'isLength',
	arguments: [0]
});

var emailValidator = validate({message: 'Invalid email', validator: 'isEmail'});

var dateSetter = function (value) {
	return ((typeof value) === 'number') ? new Date(value) : value;
};

// Common data types.
exports.STRING = {type: String, required: true, default: '', trim: true, validate: stringValidator};
exports.OPTIONAL_STRING = {type: String, trim: true, validate: optionalStringValidator};
exports.EMAIL = {type: String, required: true, default: '', trim: true, validate: emailValidator};
exports.NUMBER = {type: Number, required: true, default: 0};
exports.POSITIVE_NUMBER = {type: Number, required: true, default: 0, min: 0};
exports.OPTIONAL_NUMBER = {type: Number, required: false};
exports.BOOLEAN = {type: Boolean, required: true, default: false};
exports.DATE = {type: Date, required: true, default: Date.now, set: dateSetter};
exports.OPTIONAL_DATE = {type: Date, required: false, set: dateSetter};
exports.OBJECT_ID = {type: Schema.Types.ObjectId};