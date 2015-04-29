import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('team-membership');
  },

  resetController: function(controller) {
    return controller.setProperties({
      showError: false,
      errorMessage: null,
      showMessage: false,
      message: null,
      newInviteEmail: null
    });
  }
});