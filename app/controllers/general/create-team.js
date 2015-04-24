import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({

  showMessage: false,
  message: null,
  showError: false,
  errorMessage: null,

  actions: {
    create: function () {

      var controller = this;

      var onSaveSuccess = function (team) {
        controller.setProperties({
          showError: false,
          showMessage: true,
          message: 'Team ' + team.get('name') + ' created successfully',
        });
      };

      var onSaveFailure = function (response) {
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