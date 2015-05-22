/*global MediumEditor*/
import Ember from 'ember';
import ImagePaste from 'teamplaybook-ember/lib/medium-extension-image-paste';
import ImageDrop from 'teamplaybook-ember/lib/medium-extension-image-drag-drop';
import ImageManualUpload from 'teamplaybook-ember/lib/medium-extension-image-upload-button';
import EditorEventHandler from 'teamplaybook-ember/lib/editor-event-handler';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  filepicker: Ember.inject.service(),

  eventHandler: function() {
    return EditorEventHandler.create({
      filepicker: this.get('filepicker.instance')
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
    var eventHandler = this.get('eventHandler');

    var editorOptions = this.initializeOptions(eventHandler);
    this.setEditorContent();
    this.set('editorInstance', new MediumEditor(this.$('.content'), editorOptions));
  }.on('didInsertElement'),

  initializeOptions: function(eventHandler) {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');

    options.extensions = {
      'image-paste': new ImagePaste({
        eventHandler: eventHandler
      }),

      'image-drop': new ImageDrop({
        eventHandler: eventHandler
      }),

      'image-manual-upload': new ImageManualUpload({
        eventHandler: eventHandler
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
    uploadDone: function(imageUrl) {
      this.ensureEditorHasSelection();

      var imgParagraph = `<p><img src="${imageUrl}"/></p>`;
      this.get('editorInstance').pasteHTML(imgParagraph);
    }
  }
});
