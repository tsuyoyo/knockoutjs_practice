define(function() {

  function saveFocusedView(viewName) {
    var localStorage = getLocalStorage();
    if (localStorage) {
      localStorage.setItem('focusedViewName', viewName);
    }
  }

  function loadFocusedView() {
    var localStorage = getLocalStorage();
    if (localStorage) {
      return localStorage.getItem('focusedViewName');
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

  function addBookmark(newItem) {
  	// TODO:
  }

  function loadBookmark() {
  	// TODO:
  }

  return {
    saveFocusedView: saveFocusedView,
    loadFocusedView: loadFocusedView
  };

});