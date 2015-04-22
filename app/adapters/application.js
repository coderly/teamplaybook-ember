import Ember from 'ember';
import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  host: Ember.computed.alias('urlInfo.apiUrl'),

  fullUrl: function (path) {
    return this.get('host') + '/' + path;
  }
});
