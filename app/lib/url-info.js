import Ember from 'ember';
import { extractSubdomainFromHostname } from 'teamplaybook-ember/lib/url-utils';
import ENV from '../config/environment';

var urlInfo = Ember.Object.extend({

  protocol: function() {
    return window.location.protocol;
  }.property(),

  port: function () {
    return window.location.port;
  }.property(),

  hostname: function(){
    return window.location.hostname;
  }.property(),

  apiUrlSetting: function() {
    return this.get('isOnRegularSubdomain') ? ENV.API_REGULAR_URL : ENV.API_TEAM_URL;
  }.property('isOnRegularSubdomain'),

  apiUrl: function() {
    var apiUrlSetting = this.get('apiUrlSetting');
    var subdomain = this.get('subdomain');
    var apiUrl = this.get('isOnRegularSubdomain') ? apiUrlSetting : apiUrlSetting.replace('subdomain', subdomain);

    return apiUrl;
  }.property('apiUrlSetting', 'isOnRegularSubdomain'),

  subdomain: function(){
    return this._computeSubdomain();
  }.property('hostname'),

  isOnRegularSubdomain: Ember.computed.equal('subdomain', 'default'),
  isOnTeamSubdomain: Ember.computed.not('isOnRegularSubdomain'),

  urlForTeam: function(team) {
    var protocol = this.get('clientProtocol');
    var subdomain = team.get('subdomain');
    var hostname = this.get('hostname');
    var port = this.get('clientPort');

    return this._buildUrl(protocol, subdomain, hostname, port);
  },

  _applySubdomainMapping: function(subdomain) {
    return ENV.subdomainMapping[subdomain] || subdomain;
  },

  _computeSubdomain: function() {
    var hostname = this.get('hostname');
    var subdomain = extractSubdomainFromHostname(hostname);
    var mappedSubdomain = this._applySubdomainMapping(subdomain);

    return mappedSubdomain;
  },

  _buildUrl: function(protocol, subdomain, hostname, port) {
    return `${protocol}://${subdomain}.${hostname}:${port}`;
  }

});

export default urlInfo;
