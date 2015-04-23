import Ember from 'ember';
import { extractSubdomainFromHostname } from 'teamplaybook-ember/lib/url-utils';
import ENV from '../config/environment';

var urlInfo = Ember.Object.extend({

  hostname: function(){
    return window.location.hostname;
  }.property(),

  apiUrl: function () {
    return 'http://' + this.get('hostname') + ':3000';
  }.property('hostname'),

  subdomain: function(){
    var hostname = this.get('hostname'),
        subdomain = extractSubdomainFromHostname(hostname),
        mappedSubdomain = this._applySubdomainMapping(subdomain);

    return mappedSubdomain;
  }.property('hostname'),

  isOnRegularSubdomain: Ember.computed.equal('subdomain', 'default'),
  isOnOrganizationSubdomain: Ember.computed.not('isOnRegularSubdomain'),

  _applySubdomainMapping: function (subdomain) {
    return ENV.subdomainMapping[subdomain] || subdomain;
  },
});

export default urlInfo;
