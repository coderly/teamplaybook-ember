import Ember from 'ember';
import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  urlInfo: Ember.inject.service(),
  host: Ember.computed.alias('urlInfo.apiUrl')
});
