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
    var extension = this;
    this.pastedImageUploader.handlePaste(event, element).then(function(response) {
      extension.handlePasteDone(response);
    });
  },

  handlePasteDone: function(response) {
    var imgParagraph = `<p><img src="${response.url}"/></p>`;
    this.base.pasteHTML(imgParagraph);
  }
});

export default ImagePasteHandler;
