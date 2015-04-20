'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var opportunities = require('../../app/controllers/opportunities.server.controller');

	// Opportunities Routes
	app.route('/opportunities')
		.get(opportunities.list)
		.post(users.requiresLogin, opportunities.create);

	app.route('/opportunities/:opportunityId')
		.get(opportunities.read)
		.put(users.requiresLogin, opportunities.hasAuthorization, opportunities.update)
		.delete(users.requiresLogin, opportunities.hasAuthorization, opportunities.delete);

	// Finish by binding the Opportunity middleware
	app.param('opportunityId', opportunities.opportunityByID);
};
