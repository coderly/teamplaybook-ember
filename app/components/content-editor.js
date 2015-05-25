/*global MediumEditor*/
import Ember from 'ember';
import ImagePaste from 'teamplaybook-ember/lib/medium-extension-image-paste';
import ImageDrop from 'teamplaybook-ember/lib/medium-extension-image-drag-drop';
import ImageManualUpload from 'teamplaybook-ember/lib/medium-extension-image-upload-button';
import ImageHandler from 'teamplaybook-ember/lib/image-handler';
import extractError from 'teamplaybook-ember/lib/extract-error';
import { ensureEditorHasSelection } from 'teamplaybook-ember/lib/medium-editor-helpers';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  filepicker: Ember.inject.service(),

  imageHandler: function() {
    return ImageHandler.create({
      filepicker: this.get('filepicker')
    });
  }.property('filepicker'),

  editorInstance: null,

  value: null,

  plaintext: false,

  disableReturn: false,
  disableToolbar: false,

  enableToolbar: Ember.computed.not('disableToolbar'),

  buttons: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'quote',
    'pre',
    'unorderedlist',
    'orderedlist',
    'anchor',
    'header1',
    'header2',
    'image-manual-upload'
  ],

  mandatoryOptions: {
    // required in order to disable the default image drag and drop functionality which embeds the image as base64
    // instead, we use our own custom functionality, which uploads the image first
    imageDragging: false
  },

  initializeEditor: function() {
    this.setContent();

    var editorOptions = this.createEditorOptions();
    this.set('editorInstance', new MediumEditor(this.$('.content'), editorOptions));

  }.on('didInsertElement'),

  createEditorOptions: function() {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');

    options.extensions = {
      'image-paste': new ImagePaste({
        target: this,
      }),

      'image-drop': new ImageDrop({
        target: this,
      }),

      'image-manual-upload': new ImageManualUpload({
        target: this,
      })
    };

    var finalOptions = Ember.merge(options, this.get('mandatoryOptions'));

    return finalOptions;
  },

  setContent: function() {
    if (this.$()) {
      this.$('.content').html(this.get('value'));
    }
  }.observes('pageId'),

  input: function() {
    if (this.get('plaintext')) {
      this.set('value', this.$('.content').text());
    } else {
      this.set('value', this.$('.content').html());
    }

    return Ember.run.debounce(this, this.notifyContentChanged, 1000);
  },

  notifyContentChanged: function() {
    this.sendAction('contentChanged');
  },

  actions: {
    imageDropped: function(event) {
      var component = this;
      var imageHandler = this.get('imageHandler');

      return imageHandler.handleImageDrop(event).then(function(response)  {
        component.onImageUploadDone(response.url);
      }, this.onFilePickerException);
    },

    imagePasted: function(event) {
      var component = this;
      var imageHandler = this.get('imageHandler');

      imageHandler.handleImagePaste(event).then(function(response)  {
        component.onImageUploadDone(response.url);
      }, this.onFilePickerException);
    },

    browseAndUpload: function() {
      var component = this;
      var imageHandler = this.get('imageHandler');

      return imageHandler.handleImageManualUpload().then(function(response) {
        return component.onImageUploadDone(response.url);
      }).catch(this.onFilePickerException);
    },
  },

  onImageUploadDone: function(imageUrl) {
    ensureEditorHasSelection(this.get('editorInstance'));

    var imgParagraph = `<p><img src="${imageUrl}"/></p>`;
    this.get('editorInstance').pasteHTML(imgParagraph);
  },

  onFilePickerException: function(exception) {
    var errorMessage = extractError(exception);
    console.log(errorMessage);
  }
});
