import Ember from 'ember';
import ClickOutsideMixin from 'teamplaybook-ember/mixins/click-outside';

export default Ember.Component.extend(ClickOutsideMixin, {
  classNames: ['team-options-menu'],

  store: Ember.inject.service(),

  currentUser: null,

  currentUsersRoleInCurrentTeam: Ember.computed.alias('currentUser.role'),
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
      var userId = this.get('currentUser.id');
      var store = this.get('store');
      store.find('team-membership').then(function(teamMemberships) {
        return teamMemberships.findBy('user.id', userId);
      }).then(function(teamMembership) {
        teamMembership.deleteRecord();
        teamMembership.save();
      });
    }
  },

  clickOutside: function() {
    this.set('isMenuVisible', false);
  }
});