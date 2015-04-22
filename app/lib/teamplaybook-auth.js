import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.create({

  urlInfo: Ember.inject.service(),

  login: function (credentials) {
    return ajax({
      type: 'POST',
      url: this._url('tokens'),
      data: {
        user: {
          email: credentials.email,
          password: credentials.password
        }
      }
    });
  },

  register: function (credentials) {
    return ajax({
      type: 'POST',
      dataType: 'json',
      url: this._url('users'),
      data: {
        user: {
          email: credentials.email,
          password: credentials.password,
          pssword_confirmation: credentials.passwordConfirmation
        }
      }
    });
  },

  _url: function (path) {
    var apiUrl = this.get('urlInfo.apiUrl');
    return apiUrl + '/' + path;
  }
});