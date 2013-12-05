define(function() {

  var KEY_FOCUSED_VIEW_NAME = 'focusedViewName';

  function saveFocusedView(viewName) {
    var localStorage = getLocalStorage();
    var hash = getHashCode(viewName);
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
    saveFocusedView: saveFocusedView,
    loadFocusedView: loadFocusedView
  };
});
