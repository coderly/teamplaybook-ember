import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function () {
    return this.store.createRecord('team');
  },
  resetController: function (controller) {
    return controller.setProperties({
      showError: false,
      errorMessage: null,
      showMessage: false,
      message: null
    });
  }
});