angular.module('users')
	.controller('UserProfileController', ['$scope', '$sce', 'Users', '$stateParams', 'MovieService', function ($scope, $sce, Users, $stateParams, MovieService) {
		$scope.init = function(){
			Users.getUserRecord($stateParams.userId).then(function(response){
				$scope.user = response.data
			});
			MovieService.getUserMovies($stateParams.userId).then(function(response){
				if(response.data){
					$scope.movies = response.data;
				}
			});
		};

		$scope.getThumbnail = function(movie){
			var thumbnails = movie.youtubeDetails.snippet.thumbnails;
			if (thumbnails.medium) {
				return thumbnails.medium.url;
			}

			if (thumbnails.standard) {
				return thumbnails.standard.url;
			}

			if (thumbnails.default) {
				return thumbnails.default.url;
			}
		};

		$scope.getDescription = function (movie) {
			movie = movie || $scope.movie;
			return movie.description || movie.youtubeDetails.snippet.description;
		};

		$scope.contactDetails = [
			{name: 'Facebook', value: 'MSPrakashKumar', type: 'fb'},
			{name: 'Twitter', value: 'MSPrakashKumar', type: 'tw'},
			{name: 'Phone', value: '+918000080000', type: 'ph'}
		];

		$scope.getLink = function(contactDetail){

			switch(contactDetail.type){
				case 'fb':
					return "https://www.facebook.com/" + contactDetail.value;
				case 'tw':
					return "https://www.twitter.com/" + contactDetail.value;
				case 'ph':
					return "tel:"+contactDetail.value;
			}
			return $sce.getTrustedResourceUrl(link);
		};

		$scope.trustSrc = function (src) {
			return $sce.trustAsResourceUrl(src);
		}
	}]);