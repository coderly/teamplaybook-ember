import Ember from 'ember';

export default Ember.Object.extend({

  filepicker: null,

  extensions: {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bpm'
  },


  handlePaste: function() {
    event.preventDefault();

    var imageBlob = event.clipboardData.items[0].getAsFile();
    var imageFile = this.createFileFromBlob(imageBlob);
    var filepicker = this.get('filepicker');

    return new Ember.RSVP.Promise(function (resolve) {
      if (Ember.isPresent(imageBlob)) {
        filepicker.store(imageFile, {}, function(response) {
          resolve(response);
        });
      }
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
