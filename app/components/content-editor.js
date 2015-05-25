/*global MediumEditor*/
import Ember from 'ember';
import ImagePaste from 'teamplaybook-ember/lib/medium-extension-image-paste';
import ImageDrop from 'teamplaybook-ember/lib/medium-extension-image-drag-drop';
import ImageManualUpload from 'teamplaybook-ember/lib/medium-extension-image-upload-button';
import ImageHandler from 'teamplaybook-ember/lib/image-handler';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  filepicker: Ember.inject.service(),

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

  createImageHandler: function() {
    return this.get('filepicker.promise').then(function(filepickerInstance) {
      return ImageHandler.create({
        filepicker: filepickerInstance
      });
    });
  },

  initializeEditor: function() {
    var component = this;
    return this.createImageHandler().then(function(imageHandler) {
      return component.createEditorOptions(imageHandler);
    }).then(function(editorOptions) {
      component.setEditorContent();
      component.set('editorInstance', new MediumEditor(component.$('.content'), editorOptions));
    });
  }.on('didInsertElement'),

  createEditorOptions: function(imageHandler) {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');

    options.extensions = {
      'image-paste': new ImagePaste({
        imageHandler: imageHandler
      }),

      'image-drop': new ImageDrop({
        imageHandler: imageHandler
      }),

      'image-manual-upload': new ImageManualUpload({
        imageHandler: imageHandler
      })
    };

    var finalOptions = Ember.merge(options, this.get('mandatoryOptions'));

    return finalOptions;
  },

  setEditorContent: function() {
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

  ensureEditorHasSelection: function() {
    var editorSelection = this.get('editorInstance').exportSelection();
    if (Ember.isEmpty(editorSelection)) {
      this.selectLastCharacterInEditorInstance();
    }
  },

  selectLastCharacterInEditorInstance: function() {
    var editorInstance = this.get('editorInstance');
    var editorContentLength = this.getEditorContentLength();
    editorInstance.importSelection({ start: editorContentLength, end: editorContentLength });
  },

  getEditorContentLength: function () {
    var editorInstance = this.get('editorInstance');
    editorInstance.selectAllContents();
    var editorSelection = editorInstance.exportSelection();
    if (Ember.isEmpty(editorSelection)) {
      var rootEditorElement = editorInstance.elements[0];
      editorInstance.selectElement(rootEditorElement);
      editorSelection = editorInstance.exportSelection();
    }

    return editorSelection.end;
  },

  actions: {
    browseAndUpload: function() {
      var component = this;
      this.createImageHandler().then(function(imageHandler) {
        return imageHandler.handleImageManualUpload();
      }).then(function(response) {
        return component.handeManualUploadDone(response.url);
      });
    },

  },

  handeManualUploadDone: function(imageUrl) {
    this.ensureEditorHasSelection();

    var imgParagraph = `<p><img src="${imageUrl}"/></p>`;
    this.get('editorInstance').pasteHTML(imgParagraph);
  }
});
