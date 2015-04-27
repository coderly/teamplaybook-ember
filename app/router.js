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
      shouldMapTeamRoutes = urlInfo.get('isOnTeamSubdomain'),
      shouldMapGeneralRoutes = urlInfo.get('isOnRegularSubdomain');

  if (shouldMapTeamRoutes) {
    this.resource('team', { path: '/' }, function () {
      this.route('home');
      this.resource('team-memberships', { path: 'members' }, function () {
        this.route('index', { path: '/'});
      });
    });
  } else if (shouldMapGeneralRoutes) {
    this.resource('general', { path: '/' }, function () {
      this.route('create-team');
    });
  }
});
