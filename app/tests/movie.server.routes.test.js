'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Movie = mongoose.model('Movie'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, movie;

/**
 * Movie routes tests
 */
describe('Movie CRUD tests', function() {
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

		// Save a user to the test db and create new Movie
		user.save(function() {
			movie = {
				name: 'Movie Name'
			};

			done();
		});
	});

	it('should be able to save Movie instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movie
				agent.post('/movies')
					.send(movie)
					.expect(200)
					.end(function(movieSaveErr, movieSaveRes) {
						// Handle Movie save error
						if (movieSaveErr) done(movieSaveErr);

						// Get a list of Movies
						agent.get('/movies')
							.end(function(moviesGetErr, moviesGetRes) {
								// Handle Movie save error
								if (moviesGetErr) done(moviesGetErr);

								// Get Movies list
								var movies = moviesGetRes.body;

								// Set assertions
								(movies[0].user._id).should.equal(userId);
								(movies[0].name).should.match('Movie Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Movie instance if not logged in', function(done) {
		agent.post('/movies')
			.send(movie)
			.expect(401)
			.end(function(movieSaveErr, movieSaveRes) {
				// Call the assertion callback
				done(movieSaveErr);
			});
	});

	it('should not be able to save Movie instance if no name is provided', function(done) {
		// Invalidate name field
		movie.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movie
				agent.post('/movies')
					.send(movie)
					.expect(400)
					.end(function(movieSaveErr, movieSaveRes) {
						// Set message assertion
						(movieSaveRes.body.message).should.match('Please fill Movie name');
						
						// Handle Movie save error
						done(movieSaveErr);
					});
			});
	});

	it('should be able to update Movie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movie
				agent.post('/movies')
					.send(movie)
					.expect(200)
					.end(function(movieSaveErr, movieSaveRes) {
						// Handle Movie save error
						if (movieSaveErr) done(movieSaveErr);

						// Update Movie name
						movie.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Movie
						agent.put('/movies/' + movieSaveRes.body._id)
							.send(movie)
							.expect(200)
							.end(function(movieUpdateErr, movieUpdateRes) {
								// Handle Movie update error
								if (movieUpdateErr) done(movieUpdateErr);

								// Set assertions
								(movieUpdateRes.body._id).should.equal(movieSaveRes.body._id);
								(movieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Movies if not signed in', function(done) {
		// Create new Movie model instance
		var movieObj = new Movie(movie);

		// Save the Movie
		movieObj.save(function() {
			// Request Movies
			request(app).get('/movies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Movie if not signed in', function(done) {
		// Create new Movie model instance
		var movieObj = new Movie(movie);

		// Save the Movie
		movieObj.save(function() {
			request(app).get('/movies/' + movieObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', movie.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Movie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Movie
				agent.post('/movies')
					.send(movie)
					.expect(200)
					.end(function(movieSaveErr, movieSaveRes) {
						// Handle Movie save error
						if (movieSaveErr) done(movieSaveErr);

						// Delete existing Movie
						agent.delete('/movies/' + movieSaveRes.body._id)
							.send(movie)
							.expect(200)
							.end(function(movieDeleteErr, movieDeleteRes) {
								// Handle Movie error error
								if (movieDeleteErr) done(movieDeleteErr);

								// Set assertions
								(movieDeleteRes.body._id).should.equal(movieSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Movie instance if not signed in', function(done) {
		// Set Movie user 
		movie.user = user;

		// Create new Movie model instance
		var movieObj = new Movie(movie);

		// Save the Movie
		movieObj.save(function() {
			// Try deleting Movie
			request(app).delete('/movies/' + movieObj._id)
			.expect(401)
			.end(function(movieDeleteErr, movieDeleteRes) {
				// Set message assertion
				(movieDeleteRes.body.message).should.match('User is not logged in');

				// Handle Movie error error
				done(movieDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Movie.remove().exec();
		done();
	});
});