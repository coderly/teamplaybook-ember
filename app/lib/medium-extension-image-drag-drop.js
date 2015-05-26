/*global MediumEditor*/

var ImageDragAndDropHandler = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var target = this.target;

    this.base.subscribe('editableDrag', function (event) {
      target.send('imageDragged', event);
    });

    this.base.subscribe('editableDrop', function (event) {
      target.send('imageDropped', event);
    });
  }
});

export default ImageDragAndDropHandler;
