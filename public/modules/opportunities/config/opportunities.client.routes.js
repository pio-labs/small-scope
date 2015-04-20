'use strict';

//Setting up route
angular.module('opportunities').config(['$stateProvider',
	function($stateProvider) {
		// Opportunities state routing
		$stateProvider.
		state('listOpportunities', {
			url: '/opportunities',
			templateUrl: 'modules/opportunities/views/list-opportunities.client.view.html'
		}).
		state('createOpportunity', {
			url: '/opportunities/create',
			templateUrl: 'modules/opportunities/views/create-opportunity.client.view.html'
		}).
		state('viewOpportunity', {
			url: '/opportunities/:opportunityId',
			templateUrl: 'modules/opportunities/views/view-opportunity.client.view.html'
		}).
		state('editOpportunity', {
			url: '/opportunities/:opportunityId/edit',
			templateUrl: 'modules/opportunities/views/edit-opportunity.client.view.html'
		});
	}
]);