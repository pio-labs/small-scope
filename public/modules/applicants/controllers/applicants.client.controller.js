'use strict';

// Applicants controller
angular.module('applicants').controller('ApplicantsController', ['$scope', '$sce', '$stateParams', '$location', 'Authentication', 'Applicants', 'Opportunities',
	function($scope, $sce, $stateParams, $location, Authentication, Applicants, Opportunities) {
		$scope.authentication = Authentication;

		// Create new Applicant
		$scope.create = function() {
			// Create new Applicant object
			var applicant = new Applicants ({
				name: this.name
			});

			// Redirect after save
			applicant.$save(function(response) {
				$location.path('applicants/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Applicant
		$scope.remove = function(applicant) {
			if ( applicant ) { 
				applicant.$remove();

				for (var i in $scope.applicants) {
					if ($scope.applicants [i] === applicant) {
						$scope.applicants.splice(i, 1);
					}
				}
			} else {
				$scope.applicant.$remove(function() {
					$location.path('applicants');
				});
			}
		};

		// Update existing Applicant
		$scope.update = function() {
			var applicant = $scope.applicant;

			applicant.$update(function() {
				$location.path('applicants/' + applicant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Applicants
		$scope.find = function() {
			$scope.applicants = Applicants.query();
		};

		// Find existing Applicant
		$scope.findOne = function() {
			$scope.applicant = Applicants.get({ 
				applicantId: $stateParams.applicantId
			});
		};

		// currently, not being used
		$scope.findOpportunity = function () {
			Opportunities.get()
		};

		$scope.trustSrc = function (src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.findApplicantRecord = function(){
			$scope.applicant = Applicants.get({applicantId: $stateParams.applicantId}, function(){
				$scope.auditionUrl = 'https://apprtc.appspot.com/r/' + $scope.applicant._id;
			});
		};
	}
]);