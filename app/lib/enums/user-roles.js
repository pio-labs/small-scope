'use strict';

var Enum = require('./enum');

var UserRoles = new Enum({
	VIEWER: 1,
	CREW:5,
	UPLOADER: 10,
	ADMIN: 100
});

module.exports = UserRoles;