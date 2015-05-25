import Ember from 'ember';
import { test, module } from 'qunit';
import ImageUploader from 'teamplaybook-ember/lib/image-uploader';

module('Library: Image uploader');

test('_extensionForType correctly maps all supported MIME types to extensions', function(assert) {
  assert.expect(4);

  var imageUploader = ImageUploader.create();

  assert.equal(imageUploader._extensionForType('image/png'), 'png');
  assert.equal(imageUploader._extensionForType('image/jpeg'), 'jpg');
  assert.equal(imageUploader._extensionForType('image/gif'), 'gif');
  assert.equal(imageUploader._extensionForType('image/bmp'), 'bpm');
});

test('_createFileFromBlob returns a File with the same type as the provided Blob, and the correct extension and size', function(assert) {
  assert.expect(3);

  var contentType = 'image/png';
  var b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
  var byteCharacters = window.atob(b64Data);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteNumbers.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new window.Uint8Array(byteNumbers);
  var blob = new window.Blob([byteArray], { type: contentType });

  var originalFile = window.File;

  window.File = function(parts) {
    this.size = parts[0].size;
    this.type = parts[0].type;
  };

  var imageUploader = ImageUploader.create();

  var file = imageUploader._createFileFromBlob(blob);

  assert.equal(file instanceof window.File, true);
  assert.equal(file.size, blob.size);
  assert.equal(file.type, blob.type);

  window.File = originalFile;
});

test('"_filepickerUpload" calls "filepicker.store"', function(assert) {
  assert.expect(1);

  var fakeFilePickerInstance = {
    store: function(file) {
      assert.equal(file, 'testFile');
      return new Ember.RSVP.Promise(function(resolve) {
        resolve({url: 'example.com' });
      });
    }
  };

  var imageUploader = ImageUploader.create({});

  imageUploader._filepickerUpload(fakeFilePickerInstance, 'testFile');
});

test('"uploadFile" calls "_filepickerUpload"', function(assert) {
  assert.expect(2);

  var fakeFilePickerPromise = new Ember.RSVP.Promise(function(resolve) {
    resolve('fakeFilepickerInstance');
  });

  var fakeFilepicker = Ember.Object.create({
    promise: fakeFilePickerPromise,
  });

  var imageUploader = ImageUploader.create({
    filepicker: fakeFilepicker,
    _filepickerUpload: function(filepicker, file) {
      assert.equal(filepicker, 'fakeFilepickerInstance');
      assert.equal(file, 'testFile');
    }
  });

  Ember.run(function() {
    imageUploader.uploadFile('testFile');
  });
});

test('"uploadBlob" calls "_createFileFromBlob", followed by calling "_filepickerUpload"', function(assert) {
  assert.expect(3);

  var fakeFilePickerPromise = new Ember.RSVP.Promise(function(resolve) {
    resolve('fakeFilepickerInstance');
  });

  var fakeFilepicker = Ember.Object.create({
    promise: fakeFilePickerPromise,
  });

  var imageUploader = ImageUploader.create({
    _createFileFromBlob: function(blob) {
      assert.equal(blob, 'testBlob');
      return 'testFile';
    },
    filepicker: fakeFilepicker,
    _filepickerUpload: function(filepicker, file) {
      assert.equal(filepicker, 'fakeFilepickerInstance');
      assert.equal(file, 'testFile');
    }
  });

  Ember.run(function() {
    imageUploader.uploadBlob('testBlob');
  });
});

test('"_filepickerBrowseAndUpload" calls "filepicker.pick"', function(assert) {
  assert.expect(1);

  var fakeFilePickerInstance = {
    pick: function(options, done, failed) {
      assert.ok(true);
      done({ url: 'example.com' });
    }
  };

  var imageUploader = ImageUploader.create({});

  Ember.run(function() {
    imageUploader._filepickerBrowseAndUpload(fakeFilePickerInstance);
  });
});

test('"pickAndUploadFile" calls "_filepickerBrowseAndUpload"', function(assert) {
  assert.expect(1);

  var fakeFilePickerPromise = new Ember.RSVP.resolve('fakeFilePickerInstance');

  var fakeFilepicker = Ember.Object.create({
    promise: fakeFilePickerPromise
  });

  var imageUploader = ImageUploader.create({
    filepicker: fakeFilepicker,
    _filepickerBrowseAndUpload: function(filepicker) {
      assert.equal(filepicker, 'fakeFilePickerInstance');
    }
  });

  Ember.run(function() {
    imageUploader.pickAndUploadFile();
  });
});