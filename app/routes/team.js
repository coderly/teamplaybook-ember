import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.find('team', this.get('urlInfo.subdomain'));
  }
});