import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  host: function () {
    var hostname = this.get('urlChecker.hostname');
    return 'https://' + hostname + ':5000';
  }.property('urlChecker.hostname')
});