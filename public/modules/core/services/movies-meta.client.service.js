'use strict';

//Menu service used for managing  menus
angular.module('core').service('movies-meta', ['$http',function($http){
    var metadata;
    var languages;
    var genres;
    var getMoviesMetaInfo=function(callback){
        if(metadata) {callback(metadata); return;}
        $http.get('/api/movies/metadata',function(data,status,headers,config){
            metadata= data;
            languages=data.languages;
            genres=data.genres;
            callback(metadata);
        });
    };
    var getLanguages=function(callback){
        if(languages){ callback(languages) ; return ;}
        $http.get('/api/languages',function(data,status,headers,config){
            languages=data;
            callback(languages);
        });
    };

    var getGenres=function(callback){
        if(genres){
            callback(genres);
            return;
        }
        $http.get('/api/genres',function(data,status,headers,config){
            genres=data;
            callback(genres);
        });
    };
}]);
