import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  model: function () {
    if (this.isAccessingOrganization()) {
      return this.store.find('organization', { subdomain: this.get('urlChecker.subdomain') }).then(function (organizations) {
        return organizations.get('firstObject');
      });
    } else {
      return null;
    }
  },

  afterModel: function (model, transition) {
    if (Ember.isPresent(model)) {
      this.transitionTo('placeholder');
    }
    return this._super(model, transition);
  },

  isAccessingOrganization: function () {
    return this.get('urlChecker.subdomain') !== 'default';
  },

  actions: {
    logout: function () {
      this.get('session').invalidate();
    }
  }
});