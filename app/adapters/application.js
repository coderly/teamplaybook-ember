import Ember from 'ember';
import DS from 'ember-data';
import JsonApiAdapter from 'ember-json-api/json-api-adapter';

var ApplicationAdapter = JsonApiAdapter.extend({
  host: function () {
    var hostname = this.get('urlChecker.hostname');
    return 'https://' + hostname + ':5000';
  }.property('urlChecker.hostname')
});

ApplicationAdapter = DS.FixtureAdapter.extend({
  queryFixtures: function (fixtures, query) {
    var key = Ember.keys(query)[0];

    return fixtures.filterBy(key, query[key]);
 }
});

export default ApplicationAdapter;
