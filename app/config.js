require.config({
  // make bower_components more sensible
  // expose jquery 
  // (メモ)
  // このpathを置き換えることによって、youtubewrapperの実態を変えることができたりする。
  // ここを依存関係の起点にするっていうのもアリかも（そうするのがrequire.js的には標準的？）
  paths: {
    "bower_components": "../bower_components",
    "jquery": "../bower_components/jquery/jquery",
    "youtubewrapper": "./modules/youtubewrapper/youtubewrapper",
    "instagramwrapper": "./modules/instagram-wrapper/instagramwrapper",
    "datastore": "./modules/datastore-offline/datastore",
    "focusdata": "./modules/datastore-offline/focusdata"
  },
  map: {
    "*": {
      "knockout": "../bower_components/knockout.js/knockout",
      "ko": "../bower_components/knockout.js/knockout"
    }
  }
});

// Use the debug version of knockout it development only
// When compiling with grunt require js will only look at the first 
// require.config({}) found in this file
require.config({
  map: {
    "*": {
      "knockout": "../bower_components/knockout.js/knockout-2.3.0.debug",
      "ko": "../bower_components/knockout.js/knockout-2.3.0.debug"
    }
  }
});

if (!window.requireTestMode) {
  require(['main'], function(){ });
}

