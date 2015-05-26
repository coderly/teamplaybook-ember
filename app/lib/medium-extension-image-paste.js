/*global MediumEditor*/

var ImagePasteHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var target = this.target;
    this.base.subscribe('editablePaste', function (event) {
      target.send('imagePasted', event);
    });
  }
});

export default ImagePasteHandler;
