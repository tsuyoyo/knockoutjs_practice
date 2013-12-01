define(function() {

  var KEY_FOCUSED_VIEW_NAME = 'focusedViewName';

  var KEY_BOOKMARK_HASHES = 'bookmarks';

  function saveFocusedView(viewName) {
    var localStorage = getLocalStorage();
    var hash = viewName.hashCode();
    if (localStorage) {
      localStorage.setItem(KEY_FOCUSED_VIEW_NAME, viewName);
    }
  }

  function loadFocusedView() {
    var localStorage = getLocalStorage();
    if (localStorage) {
      return localStorage.getItem(KEY_FOCUSED_VIEW_NAME);
    } else {
      return 'bookmark';
    }
  }

  function getLocalStorage() {
    var localStorage = window.localStorage;
    if (!localStorage) {
      console.log("localStorage isn't supported in this runtime");
    }
    return localStorage;
  }

  function addBookmarkLocalStorage(newItem) {
    var hash = getHashCode(newItem.contentUrl);
    addHashToLocalStorageArray(hash);
    localStorage[hash].setItem(newItem.toString);
  }

  function removeBookmarkLocalStorage(removeItem) {
    var hash = getHashCode(newItem.contentUrl);
    removeHashFromLocalStorageArray(hash);
    localStorage[hash].removeItem();
  }

  function loadBookmarkFromLocalStorage() {
    var localStorage = getLocalStorage();
    if (localStorage) {
      var hashesData = localStorage[KEY_BOOKMARK_HASHES];
      if (hashesData) {
        return loadDataObject(hashesData.split(','), localStorage);
      }
    }
    return [];
  }

  function loadDataObject(hashes, localStorage) {
    var data = [];
    for (var i=0; i<hashes.length; i++) {
      data.push(localStorage.getItem(hashes[i]).toJSON());
    }
    return data;S
  }

  // This is to culculate identifier for each bookmark ßfrom it's URL.
  // (referred)
  // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  function getHashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash<<5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Referred : 
  // http://d.hatena.ne.jp/fjwr38/20120318/1332077105
  function addHashToLocalStorageArray(hash){
    var localStorage = getLocalStorage();
    if (localStorage) {
      var arr = localStorage["key"].sprit(",");
      arr.push(hash);
      localStorage["key"] = arr.toString();      
    }
  };

  function removeHashFromLocalStorageArray(hash){
    var localStorage = getLocalStorage();
    if (localStorage) {
      var arr = localStorage["key"].sprit(",");
      for(var i = 0; i < arr.length; i++){
          if(hash == arr[i]) {
            delete arr[i];
          }
      }
      localStorage["key"] = arr.toString();
    }
  };

  function isBookmarked(data) {
    // loadして

    // dataのURLでhash計算して

    // loadしたbookmarkの中にあるかどうかをreturn.
  }

  return {
    saveFocusedView: saveFocusedView,
    loadFocusedView: loadFocusedView,
    addBookmark: addBookmarkLocalStorage,
    removeBookmark: removeBookmarkLocalStorage,
    loadBookmark: loadBookmarkFromLocalStorage
  };

});