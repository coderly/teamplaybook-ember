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

  apiUrl: function () {
    return  this.get('apiProtocol') + '://' + this.get('hostname') + ':' + this.get('apiPort');
  }.property('apiProtocol', 'hostname', 'apiPort'),

  subdomain: function(){
    var hostname = this.get('hostname');
    var subdomain = extractSubdomainFromHostname(hostname);
    var mappedSubdomain = this._applySubdomainMapping(subdomain);

    return mappedSubdomain;
  }.property('hostname'),

  isOnRegularSubdomain: Ember.computed.equal('subdomain', 'default'),
  isOnTeamSubdomain: Ember.computed.not('isOnRegularSubdomain'),

  _applySubdomainMapping: function (subdomain) {
    return ENV.subdomainMapping[subdomain] || subdomain;
  },

  urlForTeam: function (team) {
    return this.get('clientProtocol') + '://' + team.get('subdomain') + '.' + this.get('hostname') + ':' + this.get('clientPort');
  }
});

export default urlInfo;
