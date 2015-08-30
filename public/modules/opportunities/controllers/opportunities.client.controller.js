'use strict';

// Opportunities controller
angular.module('opportunities').controller('OpportunitiesController', ['$scope', '$stateParams', '$location', '$state', 'Authentication', 'Opportunities', 'MoviesMeta', 'MovieService', 'Applicants',
	function ($scope, $stateParams, $location, $state, Authentication, Opportunities, MoviesMeta, MovieService, Applicants) {
		$scope.authentication = Authentication;
		$scope.userProjects = [];
		$scope.metaInfo = {crewTypes: []};
		$scope.opportunity = {};
		$scope.applicants = [];

		if (!Authentication.user) {
			return $state.go('signin');
		}

		MoviesMeta.getMoviesMetaInfo(function (err, data) {
			if (err) return;
			$scope.metaInfo = data;
		});

		MovieService.getUserMovies(Authentication.user._id).then(function (response) {
			if (response.data) {
				$scope.userProjects = response.data;
			}
		});
		// Create new Opportunity
		$scope.create = function () {
			// Create new Opportunity object
			var opportunity = new Opportunities($scope.opportunity);
			opportunity.project = opportunity.project._id;
			// Redirect after save
			opportunity.$save(function (response) {
				$location.path('opportunities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Opportunity
		$scope.remove = function (opportunity) {
			if (opportunity) {
				opportunity.$remove();

				for (var i in $scope.opportunities) {
					if ($scope.opportunities [i] === opportunity) {
						$scope.opportunities.splice(i, 1);
					}
				}
			} else {
				$scope.opportunity.$remove(function () {
					$location.path('opportunities');
				});
			}
		};

		// Update existing Opportunity
		$scope.update = function () {
			var opportunity = $scope.opportunity;

			opportunity.$update(function () {
				$location.path('opportunities/' + opportunity._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Opportunities
		$scope.find = function () {
			$scope.opportunities = Opportunities.query();
		};

		// Find existing Opportunity
		$scope.findOne = function () {
			$scope.opportunity = Opportunities.get({
				opportunityId: $stateParams.opportunityId
			});
		};

		$scope.apply = function () {
			var applicant = new Applicants({
				opportunity: $scope.opportunity._id,
				movie: $scope.opportunity.project._id,
				applicant: $scope.authentication.user._id
			});
			applicant.$save(function () {
				$scope.hasApplied = true;
			});
		};

		$scope.initViewOpportunity = function () {
			$scope.findOne();

			Applicants.getOpportunityApplicants($stateParams.opportunityId).then(function(response){
				if(response.data){
					$scope.applicants = response.data;
					$scope.hasApplied = !!($scope.myApplication = _.find($scope.applicants, function(record){
						return record.applicant._id == $scope.authentication.user._id;
					}));
				}
			});
		};
	}
]);
