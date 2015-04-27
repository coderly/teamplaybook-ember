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

      var onSaveSuccess = function (organization) {
        controller.setProperties({
          showError: false,
          showMessage: true,
          message: 'Organization ' + organization.get('name') + ' created successfully',
        });
      };

      var onSaveFailure = function (response) {
        controller.setProperties({
          showMessage: false,
          showError: true,
          errorMessage: extractError(response)
        });
      };

      var organization = this.get('model');
      organization.save().then(onSaveSuccess, onSaveFailure);
    }
  }
});