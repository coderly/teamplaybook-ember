import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR) {

    var secureData = this.get('session.secure');

    if (this.get('session.isAuthenticated')) {
      jqXHR.setRequestHeader('X-User-Email', secureData.email);
      jqXHR.setRequestHeader('X-User-Token', secureData.authentication_token);
    }
  }
});
