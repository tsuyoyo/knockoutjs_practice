define(function() {

  function getVideoTitle(id, callback) {
    var url = 'http://gdata.youtube.com/feeds/api/videos/' + id + '?alt=json';
    callApi(url, callback, function(jsonData) {
      return jsonData.entry.title.$t;
    });
  }

  function searchVideo(keyword, callback, startIndex) {
    var url = 'http://gdata.youtube.com/feeds/api/videos/-/' + keyword
      + '?v=2' 
      + '&alt=json' 
      + '&max-results=20'
    callApi(url, callback, parseJson);
  }

  function parseJson(jsonData) {
    var entry = jsonData.feed.entry;
    var videos = [];
    if (entry) {
      for (var i=0; i<entry.length; i++) {
        videos.push(parseEntry(entry[i]));
      }
    }
    return videos;    
  }

  function parseEntry(entry) {
    var contentUrl;
    var thumbnail;
    var title;

    // Content URL
    // https://developers.google.com/youtube/2.0/reference?hl=ja#youtube_data_api_tag_id
    // <id> タグは、フィードまたは動画のエントリを、一意かつ永続的に識別する URN を示します。
    // <id>tag:youtube,2008:video:24Ryj1ywosw</id>
    // --> replace('tag:youtube,2008:video:','') これでidが取れる
    // <iframe width="560" height="315" src="http://www.youtube.com/embed/'+id+'?&rel=0" frameborder="0"></iframe>
    var id = entry.id.$t.replace('tag:youtube.com,2008:video:','');
    contentUrl = 'http://www.youtube.com/embed/' + id + '?&rel=0';

    var html = '<iframe src="' + contentUrl + '" id="youtube-viewer" frameborder="0"></iframe>'

    // サムネイル
    entry.media$group.media$thumbnail.forEach(function(value) {
      var content = value;
      // (w, h) = (360, 480) のサムネイルをとる
      if (content.yt$name === 'hqdefault') {
        thumbnail = content.url;
      }
    });
  
    // Title
    title = entry.media$group.media$title.$t;

    return {contentHtml: html, contentUrl: contentUrl, thumbnail: thumbnail, title: title};
  }

  function callApi(apiUrl, callback, jsonParser) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
          var jsonData = JSON.parse(xhr.responseText);
          callback(jsonParser(jsonData));
        }
      }
    xhr.send();
  }

  return {
    getVideoTitle: getVideoTitle,
    searchVideo: searchVideo
  };

});

