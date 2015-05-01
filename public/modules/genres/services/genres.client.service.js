'use strict';

//Genres service used to communicate Genres REST endpoints
angular.module('genres').factory('Genres', ['$resource',
	function($resource) {
		return $resource('/api/genres/:genreId', { genreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
