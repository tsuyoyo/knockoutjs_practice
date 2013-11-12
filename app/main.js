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
  	
  	this.searchKeyword = ko.observable("");

  }

  // （メモ）
  // http://kojs.sukobuto.com/docs/observables
  // ２つ目の引数はオプションです。ViewModel をバインドする対象のDOM要素を指定することができます。
  // これにより、ID「someElementId」が付与された要素と、その配下の要素に対してのみバインドを適用することができます。
  // １つのページに対して、部分ごとに異なる ViewModel をバインドさせるといった使い方ができます。
  ko.applyBindings(new viewModel(), $('html')[0]);
});
