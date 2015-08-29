'use strict';

var _ = require('lodash');

function Enum(records) {
	this.records = records;
	_.extend(this, records);
}

Enum.prototype.getAll = function () {
	return _.values(this.records);
};

module.exports = Enum;