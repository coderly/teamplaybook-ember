import Ember from 'ember';
import ImageUploader from 'teamplaybook-ember/lib/image-uploader';

export default Ember.Object.extend({

  filepicker: null,

  imageUploader: function() {
    return ImageUploader.create({
      filepicker: this.get('filepicker'),
    });
  }.property('filepicker'),

  handleImagePaste: function() {
    event.preventDefault();

    var imageBlob = event.clipboardData.items[0].getAsFile();
    var imageUploader = this.get('imageUploader');

    if (Ember.isPresent(imageBlob)) {
      return imageUploader.uploadBlob(imageBlob);
    }
  },

  handleImageDrop: function() {
    event.preventDefault();
    event.stopPropagation();

    var imageFile = event.dataTransfer.files[0];
    var imageUploader = this.get('imageUploader');

    if (Ember.isPresent(imageFile)) {
      return imageUploader.uploadFile(imageFile);
    }
  },

  handleImageManualUpload: function () {
    var imageUploader = this.get('imageUploader');

    return imageUploader.pickAndUploadFile();
  }
});
