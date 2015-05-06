import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({
  needs: ['team'],

  newInviteEmail: null,

  showError: false,
  errorMessage: null,

  showMessage: false,
  message: null,

  createInviteNotAllowed: Ember.computed.empty('newInviteEmail'),

  currentUserIsTeamOwner: function() {
    var teamOwnerId = this.get('controllers.team.model.owner.id');
    var currentUserId = this.get('session.secure.id');
    return teamOwnerId === currentUserId;
  }.property('session'),

  actions: {
    createInvite: function() {
      var controller = this;
      var email = this.get('newInviteEmail');
      var teamMembership = this.store.createRecord('teamMembership', { email: email });

      var onSuccess = function(teamMembership) {
        var email = teamMembership.get('email');

        controller.setProperties({
          newInviteEmail: null,
          showMessage: true,
          message: `Invite successfully sent to ${email}`,
          showError: false,
          error: null
        });
      };

      var onFailure = function(response) {
        controller.setProperties({
          showMessage: false,
          message: null,
          showError: true,
          errorMessage: extractError(response)
        });
      };

      teamMembership.save().then(onSuccess, onFailure);
    },

    message: function(message) {
      this.setProperties({
        showError: false,
        message: message,
        showMessage: true
      });
    },

    error: function(error) {
      this.setProperties({
        showMessage: false,
        errorMessage: error,
        showError: true
      });
    }
  }
});