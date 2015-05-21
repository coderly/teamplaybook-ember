/*global MediumEditor*/
import Ember from 'ember';
import ImagePaste from 'teamplaybook-ember/lib/medium-extension-image-paste';
import ImageDrop from 'teamplaybook-ember/lib/medium-extension-image-drag-drop';
import EditorEventHandler from 'teamplaybook-ember/lib/editor-event-handler';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  filepicker: Ember.inject.service(),

  value: null,

  plaintext: false,

  disableReturn: false,
  disableToolbar: false,
  buttons: ['bold', 'italic', 'underline', 'strikethrough', 'quote', 'pre', 'unorderedlist', 'orderedlist', 'anchor', 'header1', 'header2'],

  mandatoryOptions: {
    // required in order to disable the default image drag and drop functionality which embeds the image as base64
    // instead, we use our own custom functionality, which uploads the image first
    imageDragging: false
  },

  initializeUploaders: function() {


    var component = this;

    return this.get('filepicker.promise').then(function(filepicker) {
      var eventHandler = EditorEventHandler.create({
        filepicker: filepicker
      });

      return component.initializeEditor(eventHandler);
    });
  }.on('didInsertElement'),


  initializeEditor: function(eventHandler) {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');

    options.extensions = {
      'image-paste': new ImagePaste({
        eventHandler: eventHandler
      }),

      'image-drop': new ImageDrop({
        eventHandler: eventHandler
      })
    };

    var finalOptions = Ember.merge(options, this.get('mandatoryOptions'))

    new MediumEditor(this.$(), finalOptions);
    return this.setContent();
  },

  setContent: function() {
    var component = this;
    if (component.$()) {
      return component.$().html(component.get('value'));
    }
  }.observes('value'),

  input: function() {
    if (this.get('plaintext')) {
      this.set('value', this.$().text());
    } else {
      this.set('value', this.$().html());
    }

    return Ember.run.debounce(this, this.notifyContentChanged, 1000);
  },

  render: function(buffer) {
    buffer.push((this.get('value') || null));
  },

  notifyContentChanged: function() {
    this.sendAction('contentChanged');
  }
});
