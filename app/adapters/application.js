import Ember from 'ember';
import DS from 'ember-data';
import JsonApiAdapter from 'ember-json-api/json-api-adapter';

var ApplicationAdapter = JsonApiAdapter.extend({
  host: function () {
    var hostname = this.get('urlInfo.hostname');
    return 'http://' + hostname + ':3000';
  }.property('urlInfo.hostname')
});

var ApplicationFixtureAdapter = DS.FixtureAdapter.extend({
  queryFixtures: function (fixtures, query) {
    var key = Ember.keys(query)[0];

    return fixtures.filterBy(key, query[key]);
 }
});

var useFixtures = true;

export default useFixtures ? ApplicationFixtureAdapter : ApplicationAdapter;
