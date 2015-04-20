import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  restore: function(data) {
    return this._super(data);
  },
  authenticate: function (options) {
    return this._super(options);
  },
  invalidate: function (data) {
    return this._super(data);
  }
});
