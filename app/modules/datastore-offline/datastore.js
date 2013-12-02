define(['focusdata'], function(focusData) {

  var KEY_BOOKMARK_HASHES = 'bookmarks';

  function getLocalStorage() {
    var localStorage = window.localStorage;
    if (!localStorage) {
      console.log("localStorage isn't supported in this runtime");
    }
    return localStorage;
  }

  function addBookmarkLocalStorage(newItem, callback) {
    var hash = getHashCode(newItem.contentUrl);
    addHashToLocalStorageArray(hash);
    localStorage[hash].setItem(newItem.toString);
    callback();
  }

  function removeBookmarkLocalStorage(removeItem, callback) {
    var hash = getHashCode(newItem.contentUrl);
    removeHashFromLocalStorageArray(hash);
    localStorage[hash].removeItem();
    callback();
  }

  function loadBookmarkFromLocalStorage() {
    return loadDataObject(loadBookmardHashes());
  }

  function loadDataObject(hashes) {
    var localStorage = getLocalStorage();
    if (localStorage) {
      var data = [];
      for (var i=0; i<hashes.length; i++) {
        data.push(localStorage.getItem(hashes[i]).toJSON());
      }
      return data;      
    }
    return [];
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

  function addHashToLocalStorageArray(hash){
    var arr = loadBookmardHashes();
    arr.push(hash);
    storeBookmarkHashes(arr);
  }

  function removeHashFromLocalStorageArray(hash){
    var arr = loadBookmardHashes();
    for(var i = 0; i < arr.length; i++){
      if(hash == arr[i]) {
        delete arr[i];
      }
    }
    storeBookmarkHashes(arr);
  }

  function storeBookmarkHashes(hashes) {
    var localStorage = getLocalStorage();
    if (localStorage) {
      localStorage[KEY_BOOKMARK_HASHES] = arr.toString();
    }    
  }

  function loadBookmardHashes() {
    var localStorage = getLocalStorage();
    if (localStorage && localStorage[KEY_BOOKMARK_HASHES]) {
      return localStorage[KEY_BOOKMARK_HASHES].split(",");
    }
    return [];
  }

  function isBookmarked(data) {
    var hashes = loadBookmardHashes();
    var dataHash = getHashCode(data.contentUrl);
    for (var i=0; i<hashes.length; i++) {
      if (hashes[i] === dataHash) {
        return true;
      }
    }
    return false;
  }

  return {
    saveFocusedView: focusData.saveFocusedView,
    loadFocusedView: focusData.loadFocusedView,
    addBookmark: addBookmarkLocalStorage,
    removeBookmark: removeBookmarkLocalStorage,
    loadBookmark: loadBookmarkFromLocalStorage,
    isBookmarked: isBookmarked
  };

});