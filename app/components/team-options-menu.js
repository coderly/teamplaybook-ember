import Ember from 'ember';
import ClickOutsideMixin from 'teamplaybook-ember/mixins/click-outside';

export default Ember.Component.extend(ClickOutsideMixin, {
  classNames: ['team-options-menu'],

  team: null,
  currentUser: null,

  currentUsersMembershipInCurrentTeam: function() {

  }.property('team', 'currentUser'),

  currentUsersRoleInCurrentTeam: Ember.computed.alias('currentUsersMemberShipInCurrentTeam.role'),
  isCurrentUserMember: Ember.computed.equal('currentUsersRoleInCurrentTeam', 'member'),
  isCurrentUserAdmin: Ember.computed.equal('currentUsersRoleInCurrentTeam', 'admin'),
  isCurrentUserAllowedToLeaveTeam: Ember.computed.or('isCurrentUserAdmin', 'isCurrentUserMember'),

  isMenuVisible: false,

  actions: {
    showMenu: function() {
      this.set('isMenuVisible', true);
    },

    logout: function() {
      this.sendAction('logout');
    },

    leaveTeam: function() {
      this.sendAction('leaveTeam');
    }
  },

  clickOutside: function() {
    this.set('isMenuVisible', false);
  }
});