import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    var store = this.get('store');
    return this.get('session.user').then(function () {
      return store.createRecord('organization');
    });
  }
});