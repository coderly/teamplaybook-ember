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

  clickHandler: function() {
    return this.get('handleClick').bind(this);
  }.property(),

  bindToWindowClick: function() {
    this._super.apply(this, arguments);
    Ember.$(window).on('click', this.get('clickHandler'));
  }.on('didInsertElement'),

  unbindFromWindowClick: function() {
    Ember.$(window).of('click', this.get('clickHandler'));
    this._super.apply(this, arguments);
  }.on('willDestroyElement'),
});