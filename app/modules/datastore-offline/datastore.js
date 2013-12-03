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
    var localStorage = getLocalStorage();
    if (localStorage) {
      addHashToLocalStorageArray(hash, localStorage);
      localStorage[hash] = JSON.stringify(newItem);
    }
    callback();
  }

  function removeBookmarkLocalStorage(removeItem, callback) {
    var hash = getHashCode(newItem.contentUrl);
    var localStorage = getLocalStorage();
    if (localStorage) {
      removeHashFromLocalStorageArray(hash, localStorage);
      localStorage.removeItem(hash);
    }
    callback();
  }

  function loadBookmarkFromLocalStorage() {
    var localStorage = getLocalStorage();
    if (localStorage) {
      var hashes = loadBookmardHashes(localStorage);
      return loadDataObject(hashes, localStorage);
    }
    return [];
  }

  function loadDataObject(hashes, localStorage) {
    var data = [];
    for (var i=0; i<hashes.length; i++) {
      var itemStr = localStorage.getItem(String(hashes[i]));
      if (itemStr && 0 < itemStr.length) {
        try {
          data.push(JSON.parse(itemStr));          
        } catch (e) {
          console.error('Parse error in loadDataObject function' + hashes[i] + itemStr);
        }
      }    
    }
    return data;
  }

  function isBookmarked(data) {
    var localStorage = getLocalStorage();
    if (localStorage) {
      var hashes = loadBookmardHashes(localStorage);
      for (var i=0, dataHash = getHashCode(data.contentUrl); i<hashes.length; i++) {
        if (hashes[i] == dataHash) {
          return true;
        }
      }
    }
    return false;
  }

  function addHashToLocalStorageArray(hash, localStorage){
    var arr = loadBookmardHashes(localStorage);
    arr.push(hash);
    storeBookmarkHashes(arr, localStorage);
  }

  function removeHashFromLocalStorageArray(hash, localStorage){
    var arr = loadBookmardHashes(localStorage);
    for(var i = 0; i < arr.length; i++){
      if(hash == arr[i]) {
        delete arr[i];
      }
    }
    storeBookmarkHashes(arr, localStorage);
  }

  function storeBookmarkHashes(hashes, localStorage) {
    localStorage[KEY_BOOKMARK_HASHES] = hashes.toString();
  }

  function loadBookmardHashes(localStorage) {
    if (localStorage[KEY_BOOKMARK_HASHES] && 0 < localStorage[KEY_BOOKMARK_HASHES].length) {
      return localStorage[KEY_BOOKMARK_HASHES].split(",");
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

  return {
    /**
     * saveFocusedView(viewName)
     *
     * @param viewName
     **/
    saveFocusedView: focusData.saveFocusedView,

    /**
     * saveFocusedView()
     *
     **/
    loadFocusedView: focusData.loadFocusedView,

    /**
     * addBookmark(newItem, callback)
     *
     * @param newItem
     * @param callback
     **/
    addBookmark: addBookmarkLocalStorage,

    /**
     * removeBookmark(removeItem, callback)
     *
     * @param newItem
     * @param callback
     **/
    removeBookmark: removeBookmarkLocalStorage,

    /**
     * loadBookmark()
     *
     * @return
     **/
    loadBookmark: loadBookmarkFromLocalStorage,

    /**
     * isBookmarked(item)
     *
     * @param item
     * @return
     **/
    isBookmarked: isBookmarked
  };

});