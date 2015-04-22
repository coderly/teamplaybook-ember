import Ember from 'ember';
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
        baseUrl = this._extractBaseUrl(hostname);

    return this._extractSubdomain(hostname, baseUrl);
  }.property('hostname'),

  isOnRegularSubdomain: Ember.computed.equal('subdomain', 'default'),
  isOnOrganizationSubdomain: Ember.computed.not('isOnRegularSubdomain'),

  _extractBaseUrl: function (hostname) {
    var lastTwoPiecesOfHostnameRegex = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
    return lastTwoPiecesOfHostnameRegex.exec(hostname);
  },

  _extractSubdomain: function (hostname, baseUrl) {

    var subdomain = '';

    if(Ember.isPresent(baseUrl)) {
      var subdomainWithTrailingDot = hostname.replace(baseUrl,'');
      subdomain = subdomainWithTrailingDot.slice(0, -1);
    }

    return this._applySubdomainMapping(subdomain);
  },

  _applySubdomainMapping: function (subdomain) {
    return ENV.subdomainMapping[subdomain] || subdomain;
  },
});

export default urlInfo;
