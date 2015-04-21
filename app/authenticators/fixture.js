import Ember from 'ember';
import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  restore: function(data) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (Ember.isPresent(data.username) && Ember.isPresent(data.password)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },
  authenticate: function (options) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (options.username && options.password) {
        resolve(options);
      } else {
        reject({ message: 'You need to provide any value as credentials to authenticate with the fixture authenticator' });
      }
    });
  },
  invalidate: function (data) {
    return this._super(data);
  }
});
