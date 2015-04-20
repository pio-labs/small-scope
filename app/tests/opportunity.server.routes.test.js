'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Opportunity = mongoose.model('Opportunity'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, opportunity;

/**
 * Opportunity routes tests
 */
describe('Opportunity CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Opportunity
		user.save(function() {
			opportunity = {
				name: 'Opportunity Name'
			};

			done();
		});
	});

	it('should be able to save Opportunity instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opportunity
				agent.post('/opportunities')
					.send(opportunity)
					.expect(200)
					.end(function(opportunitySaveErr, opportunitySaveRes) {
						// Handle Opportunity save error
						if (opportunitySaveErr) done(opportunitySaveErr);

						// Get a list of Opportunities
						agent.get('/opportunities')
							.end(function(opportunitiesGetErr, opportunitiesGetRes) {
								// Handle Opportunity save error
								if (opportunitiesGetErr) done(opportunitiesGetErr);

								// Get Opportunities list
								var opportunities = opportunitiesGetRes.body;

								// Set assertions
								(opportunities[0].user._id).should.equal(userId);
								(opportunities[0].name).should.match('Opportunity Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Opportunity instance if not logged in', function(done) {
		agent.post('/opportunities')
			.send(opportunity)
			.expect(401)
			.end(function(opportunitySaveErr, opportunitySaveRes) {
				// Call the assertion callback
				done(opportunitySaveErr);
			});
	});

	it('should not be able to save Opportunity instance if no name is provided', function(done) {
		// Invalidate name field
		opportunity.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opportunity
				agent.post('/opportunities')
					.send(opportunity)
					.expect(400)
					.end(function(opportunitySaveErr, opportunitySaveRes) {
						// Set message assertion
						(opportunitySaveRes.body.message).should.match('Please fill Opportunity name');
						
						// Handle Opportunity save error
						done(opportunitySaveErr);
					});
			});
	});

	it('should be able to update Opportunity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opportunity
				agent.post('/opportunities')
					.send(opportunity)
					.expect(200)
					.end(function(opportunitySaveErr, opportunitySaveRes) {
						// Handle Opportunity save error
						if (opportunitySaveErr) done(opportunitySaveErr);

						// Update Opportunity name
						opportunity.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Opportunity
						agent.put('/opportunities/' + opportunitySaveRes.body._id)
							.send(opportunity)
							.expect(200)
							.end(function(opportunityUpdateErr, opportunityUpdateRes) {
								// Handle Opportunity update error
								if (opportunityUpdateErr) done(opportunityUpdateErr);

								// Set assertions
								(opportunityUpdateRes.body._id).should.equal(opportunitySaveRes.body._id);
								(opportunityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Opportunities if not signed in', function(done) {
		// Create new Opportunity model instance
		var opportunityObj = new Opportunity(opportunity);

		// Save the Opportunity
		opportunityObj.save(function() {
			// Request Opportunities
			request(app).get('/opportunities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Opportunity if not signed in', function(done) {
		// Create new Opportunity model instance
		var opportunityObj = new Opportunity(opportunity);

		// Save the Opportunity
		opportunityObj.save(function() {
			request(app).get('/opportunities/' + opportunityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', opportunity.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Opportunity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Opportunity
				agent.post('/opportunities')
					.send(opportunity)
					.expect(200)
					.end(function(opportunitySaveErr, opportunitySaveRes) {
						// Handle Opportunity save error
						if (opportunitySaveErr) done(opportunitySaveErr);

						// Delete existing Opportunity
						agent.delete('/opportunities/' + opportunitySaveRes.body._id)
							.send(opportunity)
							.expect(200)
							.end(function(opportunityDeleteErr, opportunityDeleteRes) {
								// Handle Opportunity error error
								if (opportunityDeleteErr) done(opportunityDeleteErr);

								// Set assertions
								(opportunityDeleteRes.body._id).should.equal(opportunitySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Opportunity instance if not signed in', function(done) {
		// Set Opportunity user 
		opportunity.user = user;

		// Create new Opportunity model instance
		var opportunityObj = new Opportunity(opportunity);

		// Save the Opportunity
		opportunityObj.save(function() {
			// Try deleting Opportunity
			request(app).delete('/opportunities/' + opportunityObj._id)
			.expect(401)
			.end(function(opportunityDeleteErr, opportunityDeleteRes) {
				// Set message assertion
				(opportunityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Opportunity error error
				done(opportunityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Opportunity.remove().exec();
		done();
	});
});