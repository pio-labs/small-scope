'use strict';

var Enum = require('./enum');

module.exports = new Enum({
	DIRECTOR: 'director',
	PRODUCER: 'producer',
	CAMERA: 'camera',
	LEAD_ACTOR: 'lead-actor',
	LEAD_ACTRESS: 'lead-actress',
	SUPPORTING_ACTOR: 'supporting-actor',
	SUPPORTING_ACTRESS: 'supporting-actress',
	OTHER: 'others'
});