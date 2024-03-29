import Ember from 'ember';
import BaseAuthenticator from 'simple-auth/authenticators/base';
import teamPlaybookAuth from 'teamplaybook-ember/lib/teamplaybook-auth';

export default BaseAuthenticator.extend({
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (Ember.isPresent(properties.authentication_token)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function(credentials) {
    return teamPlaybookAuth.login(credentials).then(function(response) {
      return response.data;
    });
  }
});
