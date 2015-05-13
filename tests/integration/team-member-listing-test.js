import Ember from 'ember';
import { test, module } from 'qunit';

import startApp from '../helpers/start-app';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import { response, buildResponse } from '../helpers/response';

import { loginSuccessResponse } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import { listOfTeamMembershipsOneOfEachRole } from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';

var App, server;

module('Team member listing', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginSuccessResponse));
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('team_memberships', response(200, listOfTeamMembershipsOneOfEachRole));
      this.get('users', response(200, listOfUsersOneForEachRole));
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

test('Navigating to "/members" requires authentication', function(assert) {
  assert.expect(1);

  visit('members');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'User is redirected to "login"');
  });
});

test('Navigating to "/members" actually navigates to "team.team-members.index"', function(assert) {
  assert.expect(1);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.team-members.index', 'Actually navigates to "team.team-members.index"');
  });
});

test('Team memberships list shows the proper amount of entries for each membership', function(assert) {
  assert.expect(2);

  server.get('team_memberships', function() {
    assert.ok(true, 'Fetches list of team memberships from the API');
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.team-membership').length, 4, 'There is a correct number of entries shown');
  });
});
