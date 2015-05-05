import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Component.extend({

  membership: null,

  isInvite: Ember.computed.equal('membership.role', 'invitee'),
  isRegistered: Ember.computed.not('isInvite'),

  actions: {
    promote: function() {
      var membership = this.get('membership');
      var component = this;

      membership.set('role', 'admin');
      membership.save().then(function () {
        var email = membership.get('user.email');
        component.sendAction('message', `Succesfuly promoted ${email}.`);
      }).catch(function(response) {
        var errorMessage = extractError(response);
        var email = membership.get('user.email');
        component.sendAction('error', `Failed to promote ${email}. The error returned was: "${errorMessage}"`);
      });
    },

    demote: function() {
      var membership = this.get('membership');
      var component = this;

      membership.set('role', 'member');
      membership.save().then(function () {
        var email = membership.get('user.email');
        component.sendAction('message', `Succesfuly demoted ${email}.`);
      }).catch(function(response) {
        var errorMessage = extractError(response);
        var email = membership.get('user.email');
        component.sendAction('error', `Failed to promote ${email}. The error returned was: "${errorMessage}"`);
      });
    }
  }
});