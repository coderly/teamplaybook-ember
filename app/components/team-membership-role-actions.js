import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['team-membership-role-actions'],

  membership: null,

  isAdmin: Ember.computed.equal('membership.role', 'admin'),
  isMember: Ember.computed.equal('membership.role', 'member'),
  isEditable: Ember.computed.any('isAdmin', 'isMember'),

  actions: {
    setRoleToAdmin: function() {
      this.setRole('admin');
    },
    setRoleToMember: function() {
      this.setRole('member');
    },
  },

  setRole: function(role) {
    var membership = this.get('membership');
    this.sendAction('updateRole', membership, role);
  }
});
