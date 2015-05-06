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

        controller.set('newInviteEmail', null);
        controller.displayMessage(`Invite successfully sent to ${email}`);
      };

      var onFailure = function(response) {
        controller.displayError(response);
      };

      teamMembership.save().then(onSuccess, onFailure);
    },

    updateRole: function(teamMembership, role) {
      var controller = this;
      teamMembership.set('role', role);
      teamMembership.save().then(function() {
        controller.displayMessage('Succesfully updated.');
      }).catch(function(response) {
        controller.displayError(response);
      });
    },

    delete: function(teamMembership) {
      var controller = this;
      teamMembership.deleteRecord();
      teamMembership.save().then(function() {
        controller.displayMessage('Succesfuly removed member from team');
      }).catch(function(response) {
        controller.displayError(response);
      });
    }
  },

  displayMessage: function(message) {
    this.setProperties({
      showError: false,
      message: message,
      showMessage: true
    });
  },

  displayError: function(response) {
    var error = extractError(response);
    this.setProperties({
      showMessage: false,
      errorMessage: error,
      showError: true
    });
  }
});