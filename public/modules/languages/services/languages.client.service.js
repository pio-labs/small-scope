'use strict';

//Languages service used to communicate Languages REST endpoints
angular.module('languages').factory('Languages', ['$resource',
	function($resource) {
		return $resource('/api/languages/:languageId', { languageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
