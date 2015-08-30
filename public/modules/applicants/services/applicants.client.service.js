'use strict';

//Applicants service used to communicate Applicants REST endpoints
angular.module('applicants').factory('Applicants', ['$resource', '$http',
	function($resource, $http) {
		var resource = $resource('/api/applicants/:applicantId', { applicantId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		resource.getOpportunityApplicants = function(opportunityId){
			return $http.get('/api/applicants/opportunity/' + opportunityId);
		};

		resource.getMyApplication = function(p){
			return $http.get('/api/applicants')
		};

		return resource;
	}
]);