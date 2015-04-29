import Ember from 'ember';
import { extractSubdomainFromHostname } from 'teamplaybook-ember/lib/url-utils';
import ENV from '../config/environment';

var urlInfo = Ember.Object.extend({

  apiProtocol: ENV.apiProtocol,
  apiPort: ENV.apiPort,

  clientProtocol: ENV.clientProtocol,
  clientPort: ENV.clientPort,

  hostname: function(){
    return window.location.hostname;
  }.property(),

  apiUrl: function() {
    return this._buildApiUrl();
  }.property('apiProtocol', 'subdomain', 'hostname', 'apiPort'),

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

  _buildApiUrl: function() {
    var protocol = this.get('apiProtocol');
    var subdomain = this.get('subdomain');
    var hostname = this.get('hostname');
    var port = this.get('apiPort');

    return  this._buildUrl(protocol, subdomain, hostname, port);
  },

  _buildUrl: function(protocol, subdomain, hostname, port) {
    return `${protocol}://${subdomain}.${hostname}:${port}`;
  }

});

export default urlInfo;
