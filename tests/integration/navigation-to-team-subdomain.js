import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response } from '../helpers/response';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';
import { basicTeamResponse } from '../mocks/team';

var App, server;

module('Navigation to team subdomain', {
  beforeEach: function() {
    server = mockServer(function() {
      this.get('team', response(200, basicTeamResponse));
      this.post('accounts/tokens', response(200, loginSuccessResponse));
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

  login();

  andThen(function() {
    assert.equal(currentRouteName(), 'team.index', 'Actually navigates to team.index');
  });
});
