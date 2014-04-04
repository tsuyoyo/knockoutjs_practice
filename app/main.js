// to depend on a bower installed component:
// define(['component/componentName/file'])

// (メモ)
// defineはRequireJS。
// baseUrlというものを指定して、jarを読み込みにいくが、
// requirejsを読み込む際に何も指定しない場合は，読み出したhtmlのディレクトリをbaseUrlとする。
// この場合、"jquery"と"knockout"の場所はconfig.jsの中でrequreJsに知らせている。
//
define(["jquery", "knockout", "youtubewrapper", "instagramwrapper", "datastore"],
function($, ko, youtubewrapper, instagramwrapper, datastore) {

  function ViewModel() {

    var BOOKMARK_VIEW_NAME = 'bookmark';

    var self = this;

    self.keyword = ko.observable("");
    
    self.views = ko.observableArray([
      {name: 'youtube', provider: youtubewrapper},
      {name: 'instagram', provider: instagramwrapper},
      {name: BOOKMARK_VIEW_NAME, provider: null}
    ]);

    self.selectedViewName = ko.observable(self.views()[0].name);

    var selectedViewProvider = self.views()[0].provider;

    self.searchContents = function() {
      selectedViewProvider.searchVideo(self.keyword(), 
        function(searchResults) {
          self.listItems.removeAll();
          self.focusedContent("");
          self.listItems(searchResults);
        }, 0);
    };

    self.listItems = ko.observableArray();

    self.focusedContent = ko.observable("");
    self.focusedContentHtml = ko.observable("");
    self.focusedContentTitle = ko.observable("");

    var bookmarkItems = datastore.loadBookmark();

    var backUpContentList = [];

    self.onViewSwitched = function(newView) {
      updateListItems(newView.name);
      self.selectedViewName(newView.name);
      for (var i=0; i<self.views().length; i++) {
        if (self.views()[i].name === newView.name) {
          selectedViewProvider = self.views()[i].provider;
          break;
        }
      }
      datastore.saveFocusedView(newView.name);
      clearFocus();
    };

    self.bookmarkFocused = function() {
      return (self.selectedViewName() === BOOKMARK_VIEW_NAME);
    };

    // メモ：FxOS、Androidの時は、ここでintentを飛ばすようにする
    self.onItemClicked = function(clickedItem) {

      function setFocusContent() {
        self.focusedContent(clickedItem.contentUrl);
        self.focusedContentHtml(clickedItem.contentHtml);
        self.focusedContentTitle(clickedItem.title);        
      }

      // MozActivityがあったらそっちでビデオの再生を試みる。
      // ダメだったらPCと同様、アプリ内にビデオの再生画面を出す。
      // TODO : 写真の場合の処理が入っていないので別途考える。
      if (typeof MozActivity !== "undefined") {
        var activity = new MozActivity({
          name: 'open',
          data: {
            type: [
              // "video/webm",
              // "video/mp4",
              // "video/3gpp",
              "video/youtube"
            ],
            url: clickedItem.contentUrl
          }
        });
        activity.onsuccess = function() {
          console.log('Succeeded to play ' + clickedItem.contentUrl);
        };
        activity.onerror = function() {
          console.log('Failed to play ' + clickedItem.contentUrl);
          setFocusContent();
        };
      } else {
        setFocusContent();
      }
    };

    self.onPlayerClosed = function() {
      clearFocus();
    };

    self.addBookmark = function(newItem, event) {
      datastore.addBookmark(newItem, function(isSuccess) {
        if (isSuccess) {
          updateBookmarkItems();
          event.target.style.visibility = 'hidden';          
        } else {
          console.log('Failed to add bookmark');
        }
      });
    };

    self.removeBookmark = function(item) {
      datastore.removeBookmark(item, function(isSuccess) {
        updateBookmarkItems();
        self.listItems(bookmarkItems);        
        event.target.style.visibility = 'hidden';
      });
    };

    self.isBookmarked = function(item) {
      return datastore.isBookmarked(item);
    };

    function clearFocus() {
      self.focusedContent('');
      self.focusedContentHtml('');
      self.focusedContentTitle('');      
    }

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
  ko.applyBindings(new ViewModel(), $('html')[0]);

});
