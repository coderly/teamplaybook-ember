import Ember from 'ember';

export default Ember.Object.extend({

  extensions: {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bpm'
  },

  filepicker: null,

  uploadBlob: function(blob) {
    var imageFile = this._createFileFromBlob(blob);

    return this.uploadFile(imageFile);
  },

  uploadFile: function(file) {
    var imageUploader = this;
    return this.get('filepicker.promise').then(function(filepicker) {
      return imageUploader._filepickerUpload(filepicker, file);
    });
  },

  pickAndUploadFile: function() {
    return this.get('filepicker.promise').then(this._filepickerBrowseAndUpload);

  },

  _filepickerUpload: function(filepicker, file) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      filepicker.store(file, {}, function(response) {
        resolve(response);
      }, function(filepickerError) {
        reject(filepickerError.toString());
      });
    });
  },

  _filepickerBrowseAndUpload: function(filepicker) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      filepicker.pick({
        mimetypes: ['image/*'],
        container: 'window',
        services: ['COMPUTER']
      }, function(blob) {
        resolve(blob);
      }, function(filepickerError) {
        reject(filepickerError.toString());
      });
    });
  },


  _extensionForType: function(type) {
    return this.extensions[type];
  },

  _createFileFromBlob: function(blob) {
    var parts = [blob];
    var creationDate = new Date();
    var extension = this._extensionForType[blob.type];
    return new window.File(parts, `${creationDate}.${extension}`, {
      lastModified: creationDate,
      type: blob.type
    });
  },

});
