'use strict';

//Opportunities service used to communicate Opportunities REST endpoints
angular.module('opportunities').factory('Opportunities', ['$resource',
	function($resource) {
		return $resource('opportunities/:opportunityId', { opportunityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);