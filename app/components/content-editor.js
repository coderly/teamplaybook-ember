/*global MediumEditor*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  value: null,

  plaintext: false,

  disableReturn: false,
  disableToolbar: false,
  buttons: ['bold', 'italic', 'underline', 'strikethrough', 'quote', 'pre', 'unorderedlist', 'orderedlist', 'anchor', 'header1', 'header2'],

  initializeEditor: function() {
    var options = this.getProperties('disableReturn', 'disableToolbar', 'buttons');
    new MediumEditor(this.$(), options);
    return this.setContent();
  }.on('didInsertElement'),

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
