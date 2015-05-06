import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response, buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';
import { basicTeamResponse } from '../mocks/team';
import { listOfNTeamMembersResponseBuilder } from '../mocks/user';

var App, server;

function login(){
  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');
}

module('Team members', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginSuccessResponse));
      this.get('team', response(200, basicTeamResponse));
      this.get('users', response(200, listOfNTeamMembersResponseBuilder(1)));
    });
    App = startApp({ subdomain: 'test'});
  },

  afterEach: function() {
    // Todo - Remove this when we update Ember from< 1.11.1
    // see https://github.com/emberjs/ember.js/issues/10310#issuecomment-95685137
    App.registry = App.buildRegistry();
    App.reset();
    server.shutdown();
    Ember.run(App, 'destroy');
  }
});

test('Navigating to "/members"', function(assert) {
  assert.expect(2);

  visit('members');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'Requires authentication.');
  });

  login();

  visit('members');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.team-members.index', 'Actually navigates to "team.team-members.index".');
  });
});

test('Team members list', function(assert) {
  assert.expect(2);

  server.get('users', function() {
    assert.ok(true, 'Fetches list of members from the API.');
    return buildResponse(200, listOfNTeamMembersResponseBuilder(5));
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('tbody tr').length, 5, 'Shows an entry for each user.');
  });
});
