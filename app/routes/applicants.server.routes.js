'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var applicants = require('../../app/controllers/applicants.server.controller');

	// Applicants Routes
	app.route('/api/applicants')
		.get(applicants.list)
		.post(users.requiresLogin, applicants.create);

	app.route('/api/applicants/:applicantId')
		.get(applicants.read)
		.put(users.requiresLogin, applicants.hasAuthorization, applicants.update)
		.delete(users.requiresLogin, applicants.hasAuthorization, applicants.delete);

	app.route('/api/applicants/opportunity/:opportunityId/')
		.get(users.requiresLogin, applicants.getOpportunityApplicants);

	// Finish by binding the Applicant middleware
	app.param('applicantId', applicants.applicantByID);
};
