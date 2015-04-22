import Ember from 'ember';
import ApplicationAdapter from 'teamplaybook-ember/adapters/application';
import DS from 'ember-data';

var useFixtures = true;

export default useFixtures? DS.FixtureAdapter.extend({
  queryFixtures: function (fixtures, query) {
    var key = Ember.keys(query)[0];

    return fixtures.filterBy(key, query[key]);
 }
}) : ApplicationAdapter;
