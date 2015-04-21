import Ember from 'ember';

export default Ember.Route.extend({
  resetController: function (controller, isExiting) {
    if (isExiting) {
      controller.setProperties({
        showError: false,
        errorMessage: null
      });
    }
  }
});