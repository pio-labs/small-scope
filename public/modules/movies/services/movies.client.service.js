'use strict';

//Movies service used to communicate Movies REST endpoints
angular.module('movies').factory('Movies', ['$resource',
	function ($resource) {
		return $resource('movies/:movieId', {
			movieId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('MovieFields', ['$resource', function ($resource) {
	return $resource('/api/movies/fields');
}]).factory('MovieVotes', ['$resource', function ($resource) {
	return $resource('/api/movies/:movieId/votes', {
		movieId: '@_id'
	}, {
		vote: {
			method: 'PUT'
		}
	});
}]).factory('MovieService', ['$http', function ($http) {
	return {
		getUserMovies : function(userId){
			return $http.get('/api/movies/user/'+userId);
		}
	}
}]);
