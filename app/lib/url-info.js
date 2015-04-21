import Ember from 'ember';
import ENV from '../config/environment';

var urlInfo = Ember.Object.extend({

  subdomain: function(){
    var regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
    var urlParts = regexParse.exec(this.get('hostname'));
    if(urlParts) {
      return this.normalize(this.get('hostname').replace(urlParts[0],'').slice(0, -1));
    } else {
      return this.normalize('');
    }
  }.property('hostname'),

  isOnRegularSubdomain: Ember.computed.equal('subdomain', 'default'),
  isOnOrganizationSubdomain: Ember.computed.not('isOnRegularSubdomain'),

  hostname: function(){
    return window.location.hostname;
  }.property(),

  normalize: function (subdomain) {
    return ENV.subdomainMapping[subdomain] || subdomain;
  },

});

export default urlInfo;
