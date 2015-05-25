/*global MediumEditor*/

var ImageDragAndDropHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var extension = this;

    this.base.subscribe('editableDrag', function (event, element) {
      var shouldHandleEvent = extension.checkIfEventShouldBeHandled(event);

      if (shouldHandleEvent) {
        extension.handleDrag(event, element);
      }
    });

    this.base.subscribe('editableDrop', function (event, element) {
      var shouldHandleEvent = extension.checkIfEventShouldBeHandled(event);

      if (shouldHandleEvent) {
        extension.handleDrop(event, element);
      }
    });
  },

  checkIfEventShouldBeHandled: function (event) {
    return event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1 && event.dataTransfer.files[0].type.indexOf('image/') > -1;
  },

  handleDrag: function(event) {
    var className = 'medium-editor-dragover';
    event.dataTransfer.dropEffect = 'copy';

    event.preventDefault();

    if (event.type === 'dragover') {
      event.target.classList.add(className);
    } else if (event.type === 'dragleave') {
      event.target.classList.remove(className);
    }
  },

  handleDrop: function(event) {
    var className = 'medium-editor-dragover';
    event.target.classList.remove(className);

    event.preventDefault();

    var extension = this;
    this.imageHandler.handleImageDrop(event).then(function(response) {
      extension.handleDropDone(response);
    });
  },

  handleDropDone: function(response) {
    var imgParagraph = `<p><img src="${response.url}"/></p>`;
    this.base.pasteHTML(imgParagraph);
  }
});

export default ImageDragAndDropHandler;
