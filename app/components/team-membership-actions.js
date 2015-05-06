import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['team-membership-actions'],
  membership: null,

  isOwner: Ember.computed.equal('membership.role', 'owner'),

  actions: {
    delete: function() {
      var membership = this.get('membership');
      this.sendAction('delete', membership);
    }
  }
});
