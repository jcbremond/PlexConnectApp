/*
 Copyright (C) 2015 Baa. All rights reserved.
 See LICENSE.txt for this sample’s licensing information
 */

/*
 Example code from Ray Wenderlich:
 http://www.raywenderlich.com/114886/beginning-tvos-development-with-tvml-tutorial
 */


var Presenter = {
  
makeDocument: function(resource) {
  if (!Presenter.parser) {
    Presenter.parser = new DOMParser();
  }
  var doc = Presenter.parser.parseFromString(resource, "application/xml");
  return doc;
},

modalDialogPresenter: function(xml) {
  navigationDocument.presentModal(xml);
},

/*
  call swift.XMLConverter with...
    template: view
    pmsId: id
    pmsPath: path
 */
load: function(view, pmsId, pmsPath) {
  console.log("load");
  
  var docString = swiftInterface.getViewIdPath(view, pmsId, pmsPath);
  var parser = new DOMParser();
  var doc = parser.parseFromString(docString, "application/xml");
    
  doc.addEventListener("select", Presenter.onSelect.bind(Presenter));
  doc.addEventListener("play", Presenter.onPlay.bind(Presenter));
  //doc.addEventListener("highlight", Presenter.onHighlight.bind(Presenter));
  doc.addEventListener("load", Presenter.onLoad.bind(Presenter));  // setup search for char entered
  
  navigationDocument.pushDocument(doc);
},
  
loadMenuContent: function(view, pmsId, pmsPath) {
  console.log("loadMenuContent");
  var elem = this.event.target;  // todo: check event existing
  var id = elem.getAttribute("id");
  
  var feature = elem.parentNode.getFeature("MenuBarDocument");
  if (feature) {
    var currentDoc = feature.getDocument(elem);
    if (!currentDoc  // todo: better algorithm to decide on doc reload
        || (id!="Search" && id!="Settings")) {  // currently: force reload on each but Settings, Search

      var docString = swiftInterface.getViewIdPath(view, pmsId, pmsPath);  // error handling?
      var parser = new DOMParser();
      var doc = parser.parseFromString(docString, "application/xml");
      
      doc.addEventListener("select", Presenter.onSelect.bind(Presenter));
      doc.addEventListener("play", Presenter.onPlay.bind(Presenter));
      doc.addEventListener("load", Presenter.onLoad.bind(Presenter));  // setup search for char entered
      
      feature.setDocument(doc, elem);
    }
  }
},

// store event for downstream use
event: "",

/*
 event handlers
 */
onSelect: function(event) {
  console.log("onSelect "+event);
  this.event = event;
  var elem = event.target;

  if (elem) {
    var id = elem.getAttribute("id");
    var onSelect = elem.getAttribute("onSelect");  // get onSelect=...
    with (event) {
      eval(onSelect);
    }
  }
},
  
onPlay: function(event) {
  console.log(event);
  var elem = event.target;
//
  Presenter.onSelect(event);
//
},
  
// grab keyboard changes for searchField
onLoad: function(event) {
  var elem = event.target;

  if (elem) {
    var onLoad = elem.getAttribute("onLoad");  // get onLoad=...
    with (event) {
      eval(onLoad);
    }
  }
},

}
