'use strict';

// Opportunities controller
angular.module('opportunities').controller('OpportunitiesController', ['$scope', '$stateParams', '$state', 'Authentication', 'Opportunities', 'MoviesMeta','MovieService',
    function ($scope, $stateParams, $state, Authentication, Opportunities, MoviesMeta,MovieService) {
        $scope.authentication = Authentication;
        $scope.userProjects=[];
        $scope.metaInfo={crewTypes: []};
        if(!Authentication.user){
            return $state.go('signin');
        }

        MoviesMeta.getMoviesMetaInfo(function(err, data){
            if(err) return;
            $scope.metaInfo=data;
        })
        MovieService.getUserMovies(Authentication.user.id).then(function(response){
            if(response.data){
                $scope.userProjects = response.data;
            }
        });
        // Create new Opportunity
        $scope.create = function () {
            // Create new Opportunity object
            var opportunity = new Opportunities({
                name: this.name
            });

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
    }
]);
