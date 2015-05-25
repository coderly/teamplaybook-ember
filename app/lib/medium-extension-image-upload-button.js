/*global MediumEditor*/
import Ember from 'ember';

var ImageUploadButton = MediumEditor.Extension.extend({

  parent: true,

  init: function() {
    this.button = this.createButton();

    var extension = this;
    this.button.click(function () {
      extension.handleClick();
    });
  },

  createButton: function() {
    return Ember.$('<button class="medium-editor-action"><b>Image</b></button>');
  },

  getButton: function() {
    return this.button[0];
  },

  handleClick: function() {
    this.target.send('browseAndUpload');
  }
});

export default ImageUploadButton;
