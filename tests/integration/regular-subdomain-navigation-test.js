import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import Ember from 'ember';

var App;

module('Regular subdomain navigation', {
  beforeEach: function() {
    App = startApp();
  },

  afterEach: function() {
    // Todo - Remove this when we update Ember from 1.11.1
    // see https://github.com/emberjs/ember.js/issues/10310#issuecomment-95685137
    App.registry = App.buildRegistry();
    App.reset();
    Ember.run(App, 'destroy');
  }
});

test('Navigating to root', function(assert) {
  assert.expect(1);

  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'general.index', 'Actually navigates to general.index');
  });
});
