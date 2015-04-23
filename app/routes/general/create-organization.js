import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function () {
    var store = this.get('store');
    return this.get('session.user').then(function () {
      return store.createRecord('organization');
    });
  }
});