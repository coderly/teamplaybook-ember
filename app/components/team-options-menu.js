import Ember from 'ember';
import ClickOutsideMixin from 'teamplaybook-ember/mixins/click-outside';

export default Ember.Component.extend(ClickOutsideMixin, {
  classNames: ['team-options-menu'],

  isMenuVisible: false,

  actions: {
    showMenu: function() {
      this.set('isMenuVisible', true);
    }
  },

  clickOutside: function() {
    this.set('isMenuVisible', false);
  }
});