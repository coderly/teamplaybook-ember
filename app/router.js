import Ember from 'ember';
import config from './config/environment';
import UrlInfo from 'teamplaybook-ember/lib/url-info';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('login');
  this.route('register');

  var urlInfo = UrlInfo.create();
  var shouldMapTeamRoutes = urlInfo.get('isOnTeamSubdomain');
  var shouldMapGeneralRoutes = urlInfo.get('isOnRegularSubdomain');

  if (shouldMapTeamRoutes) {
    this.route('team', { path: '/' }, function() {
      this.route('team-members', { path: 'members' }, function() {
        this.route('index', { path: '/' });
      });
    });
  } else if (shouldMapGeneralRoutes) {
    this.route('general', { path: '/' }, function() {
      this.route('create-team');
    });
  }
});
