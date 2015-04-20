var https=require('https');
var BASE_URL='https://www.googleapis.com/youtube/v3/videos';
var BASE_URL_HOST = 'www.googleapis.com/';
var BASE_URL_PATH='youtube/v3/videos';
var KEY='AIzaSyA00E5JTN7Ik492aNjCHfgESkWqlDO_FRc';
var PARTS={
    CONTENTDETAILS:'contentDetails',
    FILEDETAILS:'fileDetails',
    ID:'id',
    LIVESTREAMINGDETAILS:'liveStreamingDetails',
    PLAYER:'player',
    PROCESSINGDETAILS:'processingDetails',
    RECORDINGDETAILS:'recordingDetails',
    SNIPPET:'snippet',
    STATISTICS:'statistics',
    STATUS:'status',
    SUGGESTIONS:'suggestions',
    TOPICDETAILS:'topicDetails'
};

var getVideoIdFromUrl = function (url) {
    return url?url.split('?v=')[1]:null;
};

var getSnippet=function (videoId,callback){
    var url=BASE_URL+'?key='+KEY+'&part='+PARTS.SNIPPET+'&id='+videoId;;
    console.log('Url :'+ url)
    var data="";
    https.get(url,function(res){
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('resp: ' + res);
        res.on('data', function (chunk) {
//			console.log('########### from  on event BODY: ' + chunk);
            data+=chunk;

        });
        res.on('end', function () {
//			console.log('$$$$$$$$$$ From End BODY: ' + data);
            callback(JSON.parse(data),null);
        });

    })
}

var getContentDetails=function (videoId,callback){
    var url=BASE_URL+'?key='+KEY+'&part='+PARTS.CONTENTDETAILS+'&id='+videoId;;
    console.log('Url :'+ url)
    https.get(url,function(res){
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('resp: ' + res);
        var data="";
        res.on('data', function (chunk) {
//			console.log('########### from  on event BODY: ' + chunk);
            data+=chunk;
        });
        res.on('end', function () {
//			console.log('$$$$$$$$$$ From End BODY: ' + data);
            callback(JSON.parse(data),null);
        });
    })
};

var getYoutubeDetailsFromUrl=function (url,callback){
    var videoId=getVideoIdFromUrl(url);
    if(!videoId) return;
    getYoutubeDetailsFromVideoId(videoId,callback);
};

var getYoutubeDetailsFromVideoId=function (videoId,callback){
    if(!videoId) return;
    getSnippet(videoId,function(data,err){
        if(err) callback(null, err);
        var snippet=data.items[0].snippet;
        getContentDetails(videoId,function(data,err){
            if(err) callback(data, err)
            var youtubeDetails={};
            youtubeDetails.contentDetails=data.items[0].contentDetails;
            youtubeDetails.snippet=snippet;
            youtubeDetails.id=videoId;
            callback(youtubeDetails, null);
        });
    });
};

exports.getSnippet=getSnippet;
exports.getYoutubeDetailsFromUrl=getYoutubeDetailsFromUrl;
exports.getYoutubeDetailsFromVideoId=getYoutubeDetailsFromVideoId;