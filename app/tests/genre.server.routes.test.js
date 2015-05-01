'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Genre = mongoose.model('Genre'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, genre;

/**
 * Genre routes tests
 */
describe('Genre CRUD tests', function() {
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

		// Save a user to the test db and create new Genre
		user.save(function() {
			genre = {
				name: 'Genre Name'
			};

			done();
		});
	});

	it('should be able to save Genre instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Genre
				agent.post('/genres')
					.send(genre)
					.expect(200)
					.end(function(genreSaveErr, genreSaveRes) {
						// Handle Genre save error
						if (genreSaveErr) done(genreSaveErr);

						// Get a list of Genres
						agent.get('/genres')
							.end(function(genresGetErr, genresGetRes) {
								// Handle Genre save error
								if (genresGetErr) done(genresGetErr);

								// Get Genres list
								var genres = genresGetRes.body;

								// Set assertions
								(genres[0].user._id).should.equal(userId);
								(genres[0].name).should.match('Genre Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Genre instance if not logged in', function(done) {
		agent.post('/genres')
			.send(genre)
			.expect(401)
			.end(function(genreSaveErr, genreSaveRes) {
				// Call the assertion callback
				done(genreSaveErr);
			});
	});

	it('should not be able to save Genre instance if no name is provided', function(done) {
		// Invalidate name field
		genre.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Genre
				agent.post('/genres')
					.send(genre)
					.expect(400)
					.end(function(genreSaveErr, genreSaveRes) {
						// Set message assertion
						(genreSaveRes.body.message).should.match('Please fill Genre name');
						
						// Handle Genre save error
						done(genreSaveErr);
					});
			});
	});

	it('should be able to update Genre instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Genre
				agent.post('/genres')
					.send(genre)
					.expect(200)
					.end(function(genreSaveErr, genreSaveRes) {
						// Handle Genre save error
						if (genreSaveErr) done(genreSaveErr);

						// Update Genre name
						genre.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Genre
						agent.put('/genres/' + genreSaveRes.body._id)
							.send(genre)
							.expect(200)
							.end(function(genreUpdateErr, genreUpdateRes) {
								// Handle Genre update error
								if (genreUpdateErr) done(genreUpdateErr);

								// Set assertions
								(genreUpdateRes.body._id).should.equal(genreSaveRes.body._id);
								(genreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Genres if not signed in', function(done) {
		// Create new Genre model instance
		var genreObj = new Genre(genre);

		// Save the Genre
		genreObj.save(function() {
			// Request Genres
			request(app).get('/genres')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Genre if not signed in', function(done) {
		// Create new Genre model instance
		var genreObj = new Genre(genre);

		// Save the Genre
		genreObj.save(function() {
			request(app).get('/genres/' + genreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', genre.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Genre instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Genre
				agent.post('/genres')
					.send(genre)
					.expect(200)
					.end(function(genreSaveErr, genreSaveRes) {
						// Handle Genre save error
						if (genreSaveErr) done(genreSaveErr);

						// Delete existing Genre
						agent.delete('/genres/' + genreSaveRes.body._id)
							.send(genre)
							.expect(200)
							.end(function(genreDeleteErr, genreDeleteRes) {
								// Handle Genre error error
								if (genreDeleteErr) done(genreDeleteErr);

								// Set assertions
								(genreDeleteRes.body._id).should.equal(genreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Genre instance if not signed in', function(done) {
		// Set Genre user 
		genre.user = user;

		// Create new Genre model instance
		var genreObj = new Genre(genre);

		// Save the Genre
		genreObj.save(function() {
			// Try deleting Genre
			request(app).delete('/genres/' + genreObj._id)
			.expect(401)
			.end(function(genreDeleteErr, genreDeleteRes) {
				// Set message assertion
				(genreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Genre error error
				done(genreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Genre.remove().exec();
		done();
	});
});