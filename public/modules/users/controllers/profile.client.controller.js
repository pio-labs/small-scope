angular.module('users')
	.controller('UserProfileController', ['$scope', 'Users', '$stateParams', 'MovieService', function ($scope, Users, $stateParams, MovieService) {
		$scope.findOne = function(){
			$scope.user = Users.get({userId: $stateParams.userId});
			MovieService.getUserMovies($stateParams.userId).then(function(response){
				if(response.data){
					$scope.movies = response.data;
				}
			});
		}
	}]);