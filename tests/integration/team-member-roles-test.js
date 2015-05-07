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

module('Team member roles', {
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

test('Role modification action by team member', function(assert) {
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
    assert.equal(find('.member .actions').length, 0, 'Is not possible');
  });
});

test('Role modification action by team admin', function(assert) {
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
    assert.equal(find('.member .actions').length, 1, 'Is possible');
  });
});

test('Role modification action by team owner', function(assert) {
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
    assert.equal(find('.member .actions').length, 1, 'Is possible');
  });
});

test('Role modification actions', function(assert){
  assert.expect(4);

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
    assert.equal(find('.invitee .actions').length, 0, 'Is not possible for team members with "invitee" role');
    assert.equal(find('.member .actions').length, 1, 'Is possible for team members with "member" role');
    assert.equal(find('.admin .actions').length, 1, 'Is possible for team members with "admin" role');
    assert.equal(find('.owner .actions').length, 0, 'Is not possible for team members with "owner" role');
  });
});

test('Setting role to "admin"', function(assert) {
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

  server.patch('team_memberships/member', function(request){
    var body = JSON.parse(request.requestBody);
    assert.equal(body.data.roles.indexOf('admin'), 0, 'Sends PATCH to API with roles property set to array containing "admin" item');
    return buildResponse(200, body);
  });

  visit('login');
  login();
  visit('members');
  andThen(function() {
    click('.member .set-admin');
  });
});

test('Setting role to "member"', function(assert) {
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

  server.patch('team_memberships/admin', function(request){
    var body = JSON.parse(request.requestBody);
    assert.equal(body.data.roles.indexOf('member'), 0, 'Sends PATCH to API with roles property set to array containing "member" item');
    return buildResponse(200, body);
  });

  visit('login');
  login();
  visit('members');
  andThen(function() {
    click('.admin .set-member');
  });
});

