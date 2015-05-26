/*global MediumEditor*/
import Ember from 'ember';

var ImageUploadButton = MediumEditor.Extension.extend({
  parent: true,

  init: function() {
    var target = this.target;

    this.button = this.createButton();
    this.button.click(function () {
      target.send('browseAndUpload');
    });
  },

  createButton: function() {
    return Ember.$('<button class="medium-editor-action"><b>Image</b></button>');
  },

  getButton: function() {
    return this.button[0];
  },
});

export default ImageUploadButton;
