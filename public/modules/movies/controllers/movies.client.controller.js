'use strict';

// Movies controller
angular.module('movies').controller('MoviesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Movies',
	function($scope, $stateParams, $location, Authentication, Movies) {
		$scope.authentication = Authentication;

		// Create new Movie
		$scope.create = function() {
			// Create new Movie object
			var movie = new Movies (this.movie);

			// Redirect after save
			movie.$save(function(response) {
				$location.path('movies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Movie
		$scope.remove = function(movie) {
			if ( movie ) { 
				movie.$remove();

				for (var i in $scope.movies) {
					if ($scope.movies [i] === movie) {
						$scope.movies.splice(i, 1);
					}
				}
			} else {
				$scope.movie.$remove(function() {
					$location.path('movies');
				});
			}
		};

		// Update existing Movie
		$scope.update = function() {
			var movie = $scope.movie;

			movie.$update(function() {
				$location.path('movies/' + movie._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Movies
		$scope.find = function() {
			$scope.movies = Movies.query();
		};

		// Find existing Movie
		$scope.findOne = function() {
			$scope.movie = Movies.get({ 
				movieId: $stateParams.movieId
			});
		};
	}
]);