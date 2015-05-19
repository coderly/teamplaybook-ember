/*global MediumEditor*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['editor'],
  tagName: 'div',

  value: null,

  plaintext: false,

  disableReturn: false,
  disableToolbar: false,


  initializeEditor: function() {
    var options = this.getProperties('disableReturn', 'disableToolbar');
    new MediumEditor(this.$(), options);
    return this.setContent();
  }.on('didInsertElement'),

  setContent: function() {
    var component = this;
    if (component.$()) {
      return component.$().html(component.get('value'));
    }
  },

  input: function() {
    if (this.get('plaintext')) {
      return this.set('value', this.$().text());
    } else {
      return this.set('value', this.$().html());
    }
  },

  render: function(buffer) {
    buffer.push((this.get('value') || null));
  },
});
