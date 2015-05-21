import Ember from 'ember';
import ImageUploader from 'teamplaybook-ember/lib/image-uploader';

export default Ember.Object.extend({

  filepicker: null,

  imageUploader: function() {
    return ImageUploader.create({
      filepicker: filepicker
    });
  }.property(),

  handlePaste: function() {
    event.preventDefault();

    var imageBlob = event.clipboardData.items[0].getAsFile();
    var imageUploader = this.get('imageUploader');

    if (Ember.isPresent(imageBlob)) {
      return imageUploader.uploadBlob(imageBlob);
    }
  },

  handleDrop: function() {
    event.preventDefault();
    event.stopPropagation();

    var imageFile = event.dataTransfer.files[0];
    var imageUploader = this.get('imageUploader');

    if (Ember.isPresent(imageFile)) {
      return imageUploader.uploadFile(imageFile);
    }
  },
});
