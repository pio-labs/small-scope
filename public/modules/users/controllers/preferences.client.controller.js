'use strict';

var mapify = function (array) {
    var map = {};
    _.each(array, function (record) {
        map[record._id] = true;
    });
    return map;
};

var filterSelected = function(selectedMap, sourceList){
    return _.filter(sourceList, function(record){
        return (selectedMap[record._id]);
    });
};

var PreferencesController = function ($scope, $http, Genres, Languages, Authentication) {
    var self = this;
    self.genres = Genres.query();
    self.languages = Languages.query();
    self.selectedGenres = mapify(Authentication.user.preferences.genres);
    self.selectedLanguages = mapify(Authentication.user.preferences.languages);
    self.likeDocumentaries = Authentication.user.preferences.like_documentaries;

    self.updatePreferences = function () {
        $http.post('/settings/preferences', {
            genres: filterSelected(self.selectedGenres, self.genres),
            languages: filterSelected(self.selectedLanguages, self.languages),
            like_documentaries: self.likeDocumentaries
        }, function (response) {
            console.log(response);
        });
    };
};


angular.module('users').controller('PreferencesController', ['$scope', '$http', 'Genres', 'Languages', 'Authentication', PreferencesController]);