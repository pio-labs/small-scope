'use strict';

//Menu service used for managing  menus
angular.module('core').service('MoviesMeta', ['$http', function ($http) {
    var metadata;
    var languages;
    var roles;
    var genres;

    this.getMoviesMetaInfo = function (callback) {
        if(metadata){
            return callback(null, metadata);
        }
         $http.get('/api/movies/fields')
             .then(function(resp){
                 metadata=resp.data;
                 roles=metadata.roles;
                 languages=metadata.languages;
                 genres= metadata.genres;
                 callback(null, metadata);
             })
             .catch(function(err){
                 callback(err, null);
             })
    };
    this.getLanguages = function (callback) {
        if (languages) {
            return callback(languages);
        }
        $http.get('/api/languages', function (data, status, headers, config) {
            languages = data;
            callback(languages);
        });
    };


    this.getGenres = function (callback) {
        if (genres) {
            callback(genres);
            return;
        }
        $http.get('/api/genres', function (data, status, headers, config) {
            genres = data;
            callback(genres);
        });
    };
}]);
