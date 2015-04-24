import Ember from 'ember';
import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function (type, id) {
    var url = [];

    url.push(this.get('host'));

    if (Ember.isPresent(id)) {
      url.push('team');
    } else {
      url.push('teams');
    }

    return url.join('/');
  },

  find: function (store, type, id) {
    return this.ajax(this.buildURL(type, id), 'GET');
  }
});
