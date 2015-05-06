import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Component.extend({

  classNames: ['team-membership-actions'],
  classNameBindings: 'membership.role',

  membership: null,

  isOwner: Ember.computed.equal('membership.role', 'owner'),

  actions: {
    delete: function() {
      var membership = this.get('membership');
      var component = this;
      membership.deleteRecord();
      membership.save().then(function() {
        component.sendAction('message', 'Succesfuly removed member from team');
      }).catch(function(response) {
        var errorMessage = extractError(response);
        membership.rollback();
        component.sendAction('error', errorMessage);
      });
    }
  }
});
