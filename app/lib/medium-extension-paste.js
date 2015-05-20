function PasteImageWithUpload () {
  // required so medium-editor will automatically set the `base` property to the current editor instance
  this.parent = true;
  this.name = 'paste-image-with-upload';

  // called during editor initialization
  this.init = function(/*instance*/) {

  };

  // called during editor destruction, for cleanup
  this.deactivate = function() {

  };

  // not used in this case
  // should be defined if extension includes a toolbar button
  // should return a DOM node or a HTML string containing the button definition
  // this.getButton = function() {}
}

export default Paste;
