define(function() {

  var CLIENT_ID = 'd381d0763e79446b86ddfc88988f5c7a';

  function searchImageByTag(tag, callback) {
    var url = 'https://api.instagram.com/v1/'
              + 'tags/' + tag 
              + '/media/recent?client_id=' + CLIENT_ID;
    callJsonp(url, callback, parseJson);
  }

  function parseJson(jsonData) {
    var data = jsonData.data;
    var images = [];
    for (var i=0; i<data.length; i++) {
      images.push(createImageData(data[i]));
    }
    return images;
  }

  function createImageData(dataEntry) {
    var contentUrl = dataEntry.images.standard_resolution.url;
    var thumbnail  = dataEntry.images.thumbnail.url;
    var titleCaption = (dataEntry.caption) ? dataEntry.caption.text : "";
    return {contentUrl: contentUrl, thumbnail: thumbnail, title: titleCaption};
  }

  function callJsonp(url, callback, jsonParser) {
    // Set callback.
    // Referred : http://requirejs.org/docs/api.html#jsonp
    var jsonpUrl = url + '&callback=define';
    require([jsonpUrl],
      function(jsonData) {
        callback(jsonParser(jsonData));
      }
    );
    // Call JSONP api.
    var target = document.createElement('script');
    target.charset = 'utf-8';
    target.src = url;
    document.body.appendChild(target);
  }

  return {
    searchVideo: searchImageByTag
  };

});

