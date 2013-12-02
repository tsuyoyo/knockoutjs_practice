define(function() {

  var KEY_FOCUSED_VIEW_NAME = 'focusedViewName';

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

  return {
    saveFocusedView: saveFocusedView,
    loadFocusedView: loadFocusedView
  };
});
