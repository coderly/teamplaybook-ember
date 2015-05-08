import Ember from 'ember';
import { test, module } from 'qunit';

import startApp from '../helpers/start-app';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import { response, buildResponse } from '../helpers/response';

import { loginResponseForSpecificRole } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import { listOfTeamMembershipsOneOfEachRole, basicTeamMembershipResponse } from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';

var App, server;

module('Team member leaves team', {
  beforeEach: function() {
    server = mockServer(function() {
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('team_memberships/member', response(200, basicTeamMembershipResponse));
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

test('"Leave team" link in team options menu', function(assert) {
  assert.expect(3);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));
  visit('login');
  login();

  andThen(function() {
    click('.team-options-menu .header');
  });

  andThen(function() {
    assert.equal(find('.team-options-menu .leave-team').length, 1, 'Is available for user with role "member"');
    server.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));
  });

  visit('login');
  login();

  andThen(function() {
    click('.team-options-menu .header');
  });

  andThen(function() {
    assert.equal(find('.team-options-menu .leave-team').length, 1, 'Is available for user with role "admin"');
    server.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));
  });

  visit('login');
  login();

  andThen(function() {
    click('.team-options-menu .header');
  });

  andThen(function() {
    assert.equal(find('.team-options-menu .leave-team').length, 0, 'Is not available for user with role "owner"');
  });
});

test('Clicking "Leave team" link in team options menu', function(assert) {
  assert.expect(3);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));
  visit('login');
  login();

  server.get('me', function() {
    assert.ok(true, 'Fetches current user from API');
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'member',
        role: 'member',
        email: 'test@example.com',
        authentication_token: 'test_token',
        links: { current_team_membership: { linkage: { type: 'team-memberships', id: 0 } }
        }
      }
    });
  });

  server.get('team_memberships/0', function() {
    assert.ok(true, 'Fetches current team membership from API');
    return buildResponse(200, {
      data: {
        id: 0,
        email: 'test@example.com',
        type: 'team-memberships'
      }
    });
  });

  server.delete('team_memberships/0', function() {
    assert.ok(true, 'Posts to API to delete the membership');
    return buildResponse(204);
  });

  andThen(function() {
    click('.team-options-menu .header');
  });

  andThen(function() {
    click('.team-options-menu .leave-team');
  });
});
