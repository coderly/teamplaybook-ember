import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({

  showError: false,
  errorMessage: null,


  actions: {
    delete: function() {
      var team = this.get('model');
      var controller = this;

      if (window.confirm('Are you sure you wish to disband this team?') === true) {
        team.deleteRecord();
        team.save().then(function () {
          controller.setProperties({
            showError: false,
            errorMessage: null
          });
        }).catch(function(response) {
          controller.setProperties({
            showError: true,
            errorMessage: extractError(response)
          });
        });
      }
    }
  }
});