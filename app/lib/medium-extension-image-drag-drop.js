/*global MediumEditor*/

var ImageDragAndDropHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var extension = this;

    this.base.subscribe('editableDrag', function (event) {
      var shouldHandleEvent = extension.checkIfEventShouldBeHandled(event);

      if (shouldHandleEvent) {
        extension.handleDrag(event);
      }
    });

    this.base.subscribe('editableDrop', function (event) {
      var shouldHandleEvent = extension.checkIfEventShouldBeHandled(event);

      if (shouldHandleEvent) {
        extension.handleDrop(event);
      }
    });
  },

  checkIfEventShouldBeHandled: function (event) {
    return event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1 && event.dataTransfer.files[0].type.indexOf('image/') > -1;
  },

  handleDrag: function(event) {
    var className = 'medium-editor-dragover';
    event.dataTransfer.dropEffect = 'copy';

    if (event.type === 'dragover') {
      event.target.classList.add(className);
    } else if (event.type === 'dragleave') {
      event.target.classList.remove(className);
    }
  },

  handleDrop: function(event) {
    var className = 'medium-editor-dragover';
    event.target.classList.remove(className);

    this.target.send('imageDropped', event);
  }
});

export default ImageDragAndDropHandler;
