/*global MediumEditor*/
import Ember from 'ember';
import ImagePaste from 'teamplaybook-ember/lib/medium-extension-image-paste';
import PastedImageUploader from 'teamplaybook-ember/lib/pasted-image-uploader';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  filepicker: Ember.inject.service(),

  value: null,

  plaintext: false,

  disableReturn: false,
  disableToolbar: false,
  buttons: ['bold', 'italic', 'underline', 'strikethrough', 'quote', 'pre', 'unorderedlist', 'orderedlist', 'anchor', 'header1', 'header2'],

  initializeUploader: function() {


    var component = this;

    return this.get('filepicker.promise').then(function(filepicker) {
      var pastedImageUploader = PastedImageUploader.create({
        filepicker: filepicker
      });

      return component.initializeEditor(pastedImageUploader);
    });
  }.on('didInsertElement'),


  initializeEditor: function(pastedImageUploader) {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');

    options.extensions = {
      'image-paste': new ImagePaste({
        pastedImageUploader: pastedImageUploader
      })
    };

    new MediumEditor(this.$(), options);
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
