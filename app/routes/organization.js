import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.find('organization', { subdomain: this.get('urlInfo.subdomain') }).then(function (results) {
      return results.get('firstObject');
    });
  },

  afterModel: function () {
    this.transitionTo('organization.home');
  }
});