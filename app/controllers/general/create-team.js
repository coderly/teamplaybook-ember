import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({

  showMessage: false,
  message: null,
  showError: false,
  errorMessage: null,
  createdTeamURL: null,

  canCreateTeam: function() {
    var name = this.get('model.name');
    var subdomain = this.get('model.subdomain');

    return Ember.isPresent(name) && Ember.isPresent(subdomain);
  }.property('model.name', 'model.subdomain'),

  teamCreationNotAllowed: Ember.computed.not('canCreateTeam'),

  actions: {
    create: function() {

      var controller = this;

      var onSaveSuccess = function(team) {
        controller.setProperties({
          showError: false,
          showMessage: true,
          message: 'Team ' + team.get('name') + ' created successfully',
          createdTeamURL: controller.get('urlInfo').urlForSubdomain(team.get('subdomain'))
        });
      };

      var onSaveFailure = function(response) {
        controller.setProperties({
          showMessage: false,
          showError: true,
          errorMessage: extractError(response)
        });
      };

      var team = this.get('model');
      team.save().then(onSaveSuccess, onSaveFailure);
    }
  }
});
