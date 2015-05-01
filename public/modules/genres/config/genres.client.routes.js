'use strict';

//Setting up route
angular.module('genres').config(['$stateProvider',
	function($stateProvider) {
		// Genres state routing
		$stateProvider.
		state('listGenres', {
			url: '/genres',
			templateUrl: 'modules/genres/views/list-genres.client.view.html'
		}).
		state('createGenre', {
			url: '/genres/create',
			templateUrl: 'modules/genres/views/create-genre.client.view.html'
		}).
		state('viewGenre', {
			url: '/genres/:genreId',
			templateUrl: 'modules/genres/views/view-genre.client.view.html'
		}).
		state('editGenre', {
			url: '/genres/:genreId/edit',
			templateUrl: 'modules/genres/views/edit-genre.client.view.html'
		});
	}
]);