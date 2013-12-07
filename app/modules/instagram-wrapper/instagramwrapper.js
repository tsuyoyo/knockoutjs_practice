define(function() {

  var CLIENT_ID = 'd381d0763e79446b86ddfc88988f5c7a';

  function searchImageByTag(tag, callback) {
    var url = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=' + CLIENT_ID;
    callApi(url, callback, parseJson);
  }

  function parseJson(jsonData) {
    return [];
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
    searchVideo: searchImageByTag
  };

});

