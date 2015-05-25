/*global MediumEditor*/

var ImagePasteHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var extension = this;
    this.base.subscribe('editablePaste', function (event) {
      var shouldHandleEvent = extension.checkIfEventShouldBeHandled(event);

      if (shouldHandleEvent) {
        extension.handlePaste(event);
      }
    });
  },

  handlePaste: function(event) {
    this.target.send('imagePasted', event);
  },

  checkIfEventShouldBeHandled: function (event) {
    return event.clipboardData && event.clipboardData.items.length === 1 && event.clipboardData.items[0].type.indexOf('image/') > -1;
  },

});

export default ImagePasteHandler;
