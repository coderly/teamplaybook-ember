import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response, buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import {
  basicTeamMembershipResponse,
  listOfTeamMembershipsOneOfEachRole,
} from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';
var App, server;

function login(){
  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');
}

module('Team member deletion', {
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

test('Membership deletion by team member', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', function() {
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'member',
        email: 'test@example.com',
        authentication_token: 'test_token'
      }
    });
  });


  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 0, 'Is not possible');
  });
});

test('Membership deletion by team admin', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', function() {
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'admin',
        email: 'test@example.com',
        authentication_token: 'test_token'
      }
    });
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 0, 'Is not possible');
  });
});

test('Membership deletion by team owner', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', function() {
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'owner',
        email: 'test@example.com',
        authentication_token: 'test_token'
      }
    });
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 1, 'Is possible');
  });
});

test('Succesful membership deletion', function(assert) {
  assert.expect(3);

  server.post('accounts/tokens', function() {
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'owner',
        email: 'test@example.com',
        authentication_token: 'test_token'
      }
    });
  });

  server.delete('team_memberships/invitee', function() {
    assert.ok(true, 'Posts to proper API endpoint');
    return buildResponse(204);
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    click('.invitee .delete');
  });

  andThen(function() {
    assert.equal(find('.message').length, 1, 'Shows success message');
    assert.equal(find('.team-membership').length, 3, 'Removes the membership from the list');
  });
});

test('Failed membership deletion', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', function() {
    return buildResponse(200, {
      data: {
        type: 'users',
        id: 'owner',
        email: 'test@example.com',
        authentication_token: 'test_token'
      }
    });
  });

  server.delete('team_memberships/invitee', function() {
    return buildResponse(405);
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    click('.invitee .delete');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message');
  });
});
