import Ember from 'ember';

export default Ember.Route.extend({
  resetController: function (controller) {
    return controller.setProperties({
      showError: false,
      errorMessage: null,
      email: null,
      password: null,
      passwordConfirmation: null
    });
  }
});