import Ember from 'ember';
import { test, module } from 'qunit';
import ImageHandler from 'teamplaybook-ember/lib/image-handler';

module('Library: Image handler');

test('handleImagePaste calls imageUploader.uploadBlob with proper parameter', function(assert) {
  assert.expect(1);

  var fakePasteItem = { getAsFile: function() { return 'test'; } };
  var fakePasteEvent = { clipboardData: { items: [ fakePasteItem ] }, stopPropagation: Ember.K, preventDefault: Ember.K };

  var imageUploader = Ember.Object.create({
    uploadBlob: function(blob) {
      assert.equal(blob, 'test');
    }
  });

  var imageHandler = ImageHandler.create({
    imageUploader: imageUploader
  });

  imageHandler.handleImagePaste(fakePasteEvent);
});

test('handleImageDrop calls imageUploader.uploadFile with proper parameter', function(assert) {
  assert.expect(1);

  var fakeDropEvent = { dataTransfer: { files: [ 'test' ] }, stopPropagation: Ember.K, preventDefault: Ember.K };

  var imageUploader = Ember.Object.create({
    uploadFile: function(file) {
      assert.equal(file, 'test');
    }
  });

  var imageHandler = ImageHandler.create({
    imageUploader: imageUploader
  });

  imageHandler.handleImageDrop(fakeDropEvent);
});

test('handleImageManualUpload calls imageUploader.pickAndUploadFile', function(assert) {
  assert.expect(1);

  var imageUploader = Ember.Object.create({
    pickAndUploadFile: function(file) {
      assert.ok(true);
    }
  });

  var imageHandler = ImageHandler.create({
    imageUploader: imageUploader
  });

  imageHandler.handleImageManualUpload();
});