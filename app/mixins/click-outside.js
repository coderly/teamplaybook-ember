import Ember from 'ember';

export default Ember.Mixin.create({
  clickOutside: Ember.K,

  handleClick: function(event) {
    var element = this.get('element');
    var $target = Ember.$(event.target);

    var didClickOutside = $target.closest(element).length === 0;

    if (didClickOutside) {
      this.clickOutside(event);
    }
  },

  bindToWindowClick: function() {
    this._super.apply(this, arguments);
    var elementId = this.get('elementId');
    var component = this;
    Ember.$(window).on(`click.${elementId}`, function(event) {
      component.handleClick(event);
    });
  }.on('didInsertElement'),

  unbindFromWindowClick: function() {
    var elementId = this.get('elementId');
    Ember.$(window).off(`click.${elementId}`);
    this._super.apply(this, arguments);
  }.on('willDestroyElement'),
});