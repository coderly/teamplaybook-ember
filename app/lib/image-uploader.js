import Ember from 'ember';

export default Ember.Object.extend({

  extensions: {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bpm'
  },

  uploadBlob: function(blob) {
    var imageFile = this.createFileFromBlob(blob);

    return this.uploadFile(imageFile)
  },

  uploadFile: function(file) {
    var filepicker = this.get('filepicker');
    return new Ember.RSVP.Promise(function (resolve) {
      filepicker.store(file, {}, function(response) {
        resolve(response);
      });
    });
  },

  createFileFromBlob: function(blob) {
    var parts = [blob];
    var creationDate = new Date();
    var extension = this.extensions[blob.type];
    return new window.File(parts, `${creationDate}.${extension}`, {
      lastModified: creationDate,
      type: blob.type
    });
  },

});
