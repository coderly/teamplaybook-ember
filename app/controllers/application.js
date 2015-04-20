import Ember from 'ember';

export default Ember.Controller.extend({
  isMainSiteBeingAccessed: Ember.computed.equal('urlChecker.subdomain', 'default'),
  isOrganizationBeingAccessed: Ember.computed.not('isMainSiteBeingAccessed')
});