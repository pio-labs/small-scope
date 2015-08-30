'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', '$http',
	function($resource, $http) {
		var usersResource = $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});

		usersResource.getUserRecord = function(userId){
			return $http.get('/api/users/' + userId);
		};

		return usersResource;
	}
]);