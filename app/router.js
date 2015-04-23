import Ember from 'ember';
import config from './config/environment';
import UrlInfo from 'teamplaybook-ember/lib/url-info';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('login');
  this.route('register');

  var urlInfo = UrlInfo.create(),
      shouldMapOrganizationRoutes = urlInfo.get('isOnOrganizationSubdomain'),
      shouldMapGeneralRoutes = urlInfo.get('isOnRegularSubdomain');

  if (shouldMapOrganizationRoutes) {
    this.route('organization', { path: '/' }, function () {
      this.route('home');
    });
  } else if (shouldMapGeneralRoutes) {
    this.route('general', { path: '/' }, function () {
      this.route('create-organization');
    });
  }
});
