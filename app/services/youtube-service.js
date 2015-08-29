'use strict';

var https = require('https');
var BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';
var BASE_URL_HOST = 'www.googleapis.com/';
var BASE_URL_PATH = 'youtube/v3/videos';
var KEY = 'AIzaSyA00E5JTN7Ik492aNjCHfgESkWqlDO_FRc';
var PARTS = {
    CONTENTDETAILS: 'contentDetails',
    FILEDETAILS: 'fileDetails',
    ID: 'id',
    LIVESTREAMINGDETAILS: 'liveStreamingDetails',
    PLAYER: 'player',
    PROCESSINGDETAILS: 'processingDetails',
    RECORDINGDETAILS: 'recordingDetails',
    SNIPPET: 'snippet',
    STATISTICS: 'statistics',
    STATUS: 'status',
    SUGGESTIONS: 'suggestions',
    TOPICDETAILS: 'topicDetails'
};

var getVideoIdFromUrl = function (url) {
    return url ? url.split('?v=')[1] : null;
};

var getSnippet = function (videoId, callback) {
    var url = BASE_URL + '?key=' + KEY + '&part=' + PARTS.SNIPPET + '&id=' + videoId;

    var data = '';
    https.get(url, function (res) {
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback(null, JSON.parse(data));
        });
    });
};

var getContentDetails = function (videoId, callback) {
    var url = BASE_URL + '?key=' + KEY + '&part=' + PARTS.CONTENTDETAILS + '&id=' + videoId;
    https.get(url, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback(null, JSON.parse(data));
        });
    });
};

var getYoutubeDetailsFromVideoId = function (videoId, callback) {
    if (!videoId){
        return callback(new Error('No Video Id'));
    }
    getSnippet(videoId, function (err, data) {
        if (err) callback(err);
        var snippet = data.items[0].snippet;
        getContentDetails(videoId, function (err, data) {
            if (err){
                return callback(err);
            }

            var youtubeDetails = {
                contentDetails : data.items[0].contentDetails,
                snippet: snippet,
                id: videoId
            };
            callback(null, youtubeDetails);
        });
    });
};

var getYoutubeDetailsFromUrl = function (url, callback) {
    var videoId = getVideoIdFromUrl(url);
    getYoutubeDetailsFromVideoId(videoId, callback);
};

exports.getSnippet = getSnippet;
exports.getYoutubeDetailsFromUrl = getYoutubeDetailsFromUrl;
exports.getYoutubeDetailsFromVideoId = getYoutubeDetailsFromVideoId;