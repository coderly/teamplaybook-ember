import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Component.extend({

  membership: null,

  isAdmin: Ember.computed.equal('membership.role', 'admin'),
  isMember: Ember.computed.equal('membership.role', 'member'),
  isEditable: Ember.computed.any('isAdmin', 'isMember'),

  actions: {
    setRole: function(role) {
      var membership = this.get('membership');
      var component = this;

      membership.set('role', role);
      membership.save().then(function () {
        component.sendAction('message', 'Succesfuly updated');
      }).catch(function(response) {
        var errorMessage = extractError(response);
        membership.rollback();
        component.sendAction('error', errorMessage);
      });
    },

    promote: function() {
      var membership = this.get('membership');
      var component = this;

      membership.set('role', 'admin');
      membership.save().then(function () {
        component.sendAction('message', 'Succesfuly updated');
      }).catch(function(response) {
        var errorMessage = extractError(response);
        membership.rollback();
        component.sendAction('error', errorMessage);
      });
    },

    demote: function() {
      var membership = this.get('membership');
      var component = this;

      membership.set('role', 'member');
      membership.save().then(function () {
        component.sendAction('message', 'Succesfuly updated');
      }).catch(function(response) {
        var errorMessage = extractError(response);
        membership.rollback();
        component.sendAction('error', errorMessage);
      });
    }
  }
});