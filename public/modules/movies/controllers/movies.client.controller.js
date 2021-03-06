'use strict';

// Movies controller
angular.module('movies').controller('MoviesController',
	['$scope', '$stateParams', '$location', '$sce', 'MovieFields', 'Authentication', 'Movies', 'MovieVotes', '$state', 'Users',
		function ($scope, $stateParams, $location, $sce, MovieFields, Authentication, Movies, MovieVotes, $state, Users) {
			$scope.authentication = Authentication;
			$scope.users = [];
			$scope.newCrew = {};
			$scope.movieCrew = [];
			// Create new Movie
			$scope.create = function () {
				// Create new Movie object
				var movie = new Movies(this.movie);

				// Redirect after save
				movie.$save(function (response) {
					//$location.path('movies/' + response._id + '/crew');
					$state.go("viewMovie", {movieId: response._id});
					// Clear form fields
					$scope.name = '';
				}, function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			MovieFields.get().$promise.then(function (movieFields) {
				$scope.metaInfo = movieFields;
			});

			// Remove existing Movie
			$scope.remove = function (movie) {
				if (movie) {
					movie.$remove();

					for (var i in $scope.movies) {
						if ($scope.movies [i] === movie) {
							$scope.movies.splice(i, 1);
						}
					}
				} else {
					$scope.movie.$remove(function () {
						$location.path('movies');
					});
				}
			};

			$scope.getThumbnail = function (movie, retina) {
				var thumbnails = movie.youtubeDetails.snippet.thumbnails;
				if (retina) {
					if (thumbnails.standard) {
						return thumbnails.standard.url;
					}
				}
				if (thumbnails.medium) {
					return thumbnails.medium.url;
				}

				if (thumbnails.standard) {
					return thumbnails.standard.url;
				}

				if (thumbnails.default) {
					return thumbnails.default.url;
				}
			};

			$scope.getDescription = function (movie) {
				movie = movie || $scope.movie;
				if (!movie._id)return;
				return movie.description || (movie.youtube_details || movie.youtubeDetails).snippet.description;
			};

			// Update existing Movie
			$scope.update = function () {
				var movie = $scope.movie;

				movie.$update(function () {
					$location.path('movies/' + movie._id);
				}, function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			// Find a list of Movies
			$scope.find = function () {
				$scope.movies = Movies.query();
			};

			$scope.trustSrc = function (src) {
				return $sce.trustAsResourceUrl(src);
			};
			$scope.initCrew = function(){
				$scope.findOne(function(){
					$scope.movieCrew = _.clone($scope.movie.crew);
				});
				$scope.users = Users.query();
			};

			// Find existing Movie
			$scope.findOne = function (callback) {
				callback = callback || function(){};

				if($scope.movie && $scope.movie._id) return callback();

				$scope.movie = Movies.get({
					movieId: $stateParams.movieId
				}, function () {
					// Got the movie
					var youtubeId = $scope.movie.youtubeDetails.id;
					if (!youtubeId) {
						var params = $scope.movie.youtubeUrl.split('?')[1].split('&');
						_.each(params, function (param) {
							var pair = param.split('=');
							if (pair[0] == 'v') {
								youtubeId = pair[1];
							}
						});
					}
					$scope.movie.embedUrl = "http://www.youtube.com/embed/" + youtubeId;
					callback();
				});

			};

			if($scope.authentication.user){
				var userVote = MovieVotes.get({
					movieId: $stateParams.movieId
				}, function () {
					$scope.userVote = userVote;
				});
			}

			$scope.voteMovie = function (newVote, currentVote) {
				if($scope.authentication.user){
					MovieVotes.vote($scope.movie._id, (newVote == currentVote) ? 0 : newVote);
				} else {
					$state.go('signin', {});
				}
			};

			$scope.addCrew = function () {
				$scope.movieCrew.push($scope.newCrew);
				$scope.newCrew = {};
				return false;
			};

			$scope.deleteCrew = function (crewMember) {
				_.remove($scope.movieCrew, crewMember);
			};

			$scope.updateUser = function () {
				Movies.update({movieId: $scope.movie._id}, {crew: $scope.movieCrew});
			};
		}
	]);
