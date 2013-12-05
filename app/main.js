// to depend on a bower installed component:
// define(['component/componentName/file'])

// (メモ)
// defineはRequireJS。
// baseUrlというものを指定して、jarを読み込みにいくが、
// requirejsを読み込む際に何も指定しない場合は，読み出したhtmlのディレクトリをbaseUrlとする。
// この場合、"jquery"と"knockout"の場所はconfig.jsの中でrequreJsに知らせている。
//
define(["jquery", "knockout", "youtubewrapper", "datastore"],
function($, ko, youtubewrapper, datastore) {

  function viewModel() {
  	
    var BOOKMARK_VIEW_NAME = 'bookmark';

    var self = this;

  	self.keyword = ko.observable("");

    self.searchContents = function() {
      youtubewrapper.searchVideo(self.keyword(), function(searchResults) {
        self.listItems.removeAll();
        self.focusedContent("");
        self.listItems(searchResults);
      }, 0);
    };

    self.views = ko.observableArray([
      {name: 'youtube', provider: null},
      {name: 'instagram', provider: null},
      {name: BOOKMARK_VIEW_NAME}
    ]);

    self.listItems = ko.observableArray();

    self.selectedViewName = ko.observable(self.views()[0].name);

    self.focusedContent = ko.observable("");

    var bookmarkItems = datastore.loadBookmark();

    var backUpContentList = [];

    self.onViewSwitched = function(newView) {
      updateListItems(newView.name);
      self.selectedViewName(newView.name);
      datastore.saveFocusedView(newView.name);
      self.focusedContent("");
    };

    self.bookmarkFocused = function() {
      return (self.selectedViewName() === BOOKMARK_VIEW_NAME);
    };

    self.onItemClicked = function(clickedItem) {
      self.focusedContent(clickedItem.contentUrl);
    };

    self.onPlayerClosed = function() {
      self.focusedContent("");
    };

    self.addBookmark = function(newItem, event) {
      datastore.addBookmark(newItem, function(isSuccess) {
        updateBookmarkItems();
        event.target.style.visibility = 'hidden';
      });
    };

    self.removeBookmark = function(newItem) {
      datastore.removeBookmark(newItem, function(isSuccess) {
        updateBookmarkItems();
        event.target.style.visibility = 'visible';
      });
    };

    self.isBookmarked = function(item) {
      return datastore.isBookmarked(item);
    };

    function updateBookmarkItems() {
      bookmarkItems = datastore.loadBookmark();
    }

    function updateListItems(newViewName) {
      // Save current shown list.
      var curView = self.selectedViewName();
      if(BOOKMARK_VIEW_NAME === newViewName) {
        backUpContentList[curView] = self.listItems();
        self.listItems(bookmarkItems);
      } else if (backUpContentList[newViewName]) {
        self.listItems(backUpContentList[newViewName]);
      } else {
        // Memo:removeAll() can't be used because all objects are destroyed.          
        self.listItems([]);
      }
    }

  }

  // （メモ）
  // http://kojs.sukobuto.com/docs/observables
  // ２つ目の引数はオプションです。ViewModel をバインドする対象のDOM要素を指定することができます。
  // これにより、ID「someElementId」が付与された要素と、その配下の要素に対してのみバインドを適用することができます。
  // １つのページに対して、部分ごとに異なる ViewModel をバインドさせるといった使い方ができます。
  ko.applyBindings(new viewModel(), $('html')[0]);
});
