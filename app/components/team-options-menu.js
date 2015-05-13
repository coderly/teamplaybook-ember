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
      this.showMenu();
    },

    logout: function() {
      this.hideMenu();
      this.sendAction('logout');
    },

    leaveTeam: function() {
      var store = this.get('store');
      var component = this;
      store.find('current-user', 'active').then(function(currentUser) {
        return currentUser.get('currentTeamMembership');
      }).then(function(teamMembership) {
        teamMembership.deleteRecord();
        return teamMembership.save();
      }).then(function () {
        component.send('logout');
      });
    }
  },

  showMenu: function() {
    this.set('isMenuVisible', true);
  },

  hideMenu: function() {
    this.set('isMenuVisible', false);
  },

  clickOutside: function() {
    this.set('isMenuVisible', false);
  }
});