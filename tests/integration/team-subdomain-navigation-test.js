import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

var App, server;

var mockJSONTeam = {
  data: {
    type: 'teams',
    id: 1,
    name: 'Test',
    subdomain: 'test'
  }
};

var mockJSONLoginSuccess = {
  data: {
    type: 'users',
    id: 1,
    email: 'test@example.com',
    authentication_token: 'test_token'
  }
};

module('Team subdomain navigation', {
  beforeEach: function() {
    server = mockServer(function () {
      this.get('team', response(200, mockJSONTeam));
      this.post('accounts/tokens', response(200, mockJSONLoginSuccess));
    });

    App = startApp({ subdomain: 'test' });
  },

  afterEach: function() {
    // Todo - Remove this when we update Ember from 1.11.1
    // see https://github.com/emberjs/ember.js/issues/10310#issuecomment-95685137
    App.registry = App.buildRegistry();
    App.reset();
    server.shutdown();

    Ember.run(App, 'destroy');
  }
});

test('Navigating to root', function(assert) {
  assert.expect(2);

  visit('/');

  andThen(function () {
    assert.equal(currentRouteName(), 'login', 'Requires logging in');
  });

  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.index', 'Actually navigates to team.index');
  });
});
