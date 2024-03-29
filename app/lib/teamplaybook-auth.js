import Ember from 'ember';
import UrlInfo from 'teamplaybook-ember/lib/url-info';
import ajax from 'ic-ajax';

var TeamPlaybookAuth = Ember.Object.extend({

  urlInfo: function() {
    return UrlInfo.create();
  }.property(),

  login: function(credentials) {
    return ajax({
      type: 'POST',
      url: this._buildURL('accounts/tokens'),
      data: {
        user: {
          email: credentials.email,
          password: credentials.password
        }
      }
    });
  },

  _buildURL: function(path) {
    var apiUrl = this.get('urlInfo.apiUrl');
    return apiUrl + '/' + path;
  }
});

export default TeamPlaybookAuth.create();
