// to depend on a bower installed component:
// define(['component/componentName/file'])

// (メモ)
// defineはRequireJS。
// baseUrlというものを指定して、jarを読み込みにいくが、
// requirejsを読み込む際に何も指定しない場合は，読み出したhtmlのディレクトリをbaseUrlとする。
// この場合、"jquery"と"knockout"の場所はconfig.jsの中でrequreJsに知らせている。
//
define(["jquery", "knockout", "youtubewrapper"], function($, ko, youtubewrapper) {

  function viewModel() {
  	
    var BOOKMARK_VIEW_NAME = 'bookmark';

    var self = this;

  	self.keyword = ko.observable("");

    self.searchContents = function() {
      youtubewrapper.searchVideo(self.keyword(), function(searchResults) {
        self.listItems.removeAll();
        self.listItems(searchResults);
      }, 0);

      // youtubewrapper.getVideoTitle(this.searchKeyword(), function(title) {
      //   self.searchResult(title);
      // });
    };

    self.listItems = ko.observableArray();

    self.views = ko.observableArray([
      {name: 'youtube', provider: null},
      {name: 'instagram', provider: null},
      {name: BOOKMARK_VIEW_NAME}
    ]);

    self.selectedViewName = ko.observable(self.views()[0].name);

    self.onViewSwitched = function(newView) {
      self.selectedViewName(newView.name);
      saveFocusedView(newView.name);
      self.listItems.removeAll();
    };

    self.bookmarkFocused = function() {
      return (self.selectedViewName() === BOOKMARK_VIEW_NAME);
    };

  }

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

  // （メモ）
  // http://kojs.sukobuto.com/docs/observables
  // ２つ目の引数はオプションです。ViewModel をバインドする対象のDOM要素を指定することができます。
  // これにより、ID「someElementId」が付与された要素と、その配下の要素に対してのみバインドを適用することができます。
  // １つのページに対して、部分ごとに異なる ViewModel をバインドさせるといった使い方ができます。
  ko.applyBindings(new viewModel(), $('html')[0]);
});
