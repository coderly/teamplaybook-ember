/*global MediumEditor*/


var ImagePasteHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var extension = this;
    this.base.subscribe('editablePaste', function (event, element) {
      extension.handlePaste(event, element);
    });
  },

  handlePaste: function(event, element) {
    var shouldHandleEvent = this.checkIfEventShouldBeHandled(event);

    if (shouldHandleEvent) {
      var extension = this;
      this.pastedImageUploader.handlePaste(event, element).then(function(response) {
        extension.handlePasteDone(response);
      });
    }
  },

  handlePasteDone: function(response) {
    var imgParagraph = `<p><img src="${response.url}"/></p>`;
    this.base.pasteHTML(imgParagraph);
  },

  checkIfEventShouldBeHandled: function (event) {
    return event.clipboardData && event.clipboardData.items.length === 1 && event.clipboardData.items[0].type.indexOf('image/') > -1;
  },

});

export default ImagePasteHandler;
