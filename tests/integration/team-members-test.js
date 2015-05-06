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
  listOfNTeamMembershipsResponseBuilder
} from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';
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
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('team_memberships', response(200, listOfNTeamMembershipsResponseBuilder(1)));
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

test('Team memberships list', function(assert) {
  assert.expect(2);

  server.get('team_memberships', function() {
    assert.ok(true, 'Fetches list of team memberships from the API.');
    return buildResponse(200, listOfNTeamMembershipsResponseBuilder(5));
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.team-membership').length, 5, 'Shows an entry for each team membership.');
  });
});

test('Form on "/members"', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('#email').length, 1, 'Shows an email field for creating a new membership.');
    assert.equal(find('#create-membership').length, 1, 'Shows a button to submit the form.');
    assert.equal(find('input').length, 2, 'Shows a total of 2 controls.');
  });
});

test('Form submission on "/members"', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('#create-membership[disabled]').length, 1, 'Is disabled when email is not filled in.');
  });

  fillIn('#email', 'membership@test.com');
  andThen(function() {
    assert.equal(find('#create-membership[disabled]').length, 0, 'Is enabled when email is filled in.');
  });
});

test('Succesful team membership creation', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('members');

  fillIn('#email', 'membership@test.com');

  andThen(function() {
    server.post('team_memberships', function() {
      assert.ok(true, 'Posts to API.');
      return buildResponse(200, basicTeamMembershipResponse);
    });
    click('#create-membership');
  });

  andThen(function() {
    assert.equal(find('.message').length, 1, 'Shows a success message.');
    assert.equal(find('.team-membership').length, 2, 'Adds the membership to the list.');
  });
});

test('Failed team membership creation', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('members');

  fillIn('#email', 'test');

  andThen(function() {
    server.post('team_memberships', response(403, {}));
    click('#create-membership');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message');
  });
});

test('Role modification action by team member', function(assert) {
  assert.expect(1);

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

test('Membership deletion by team member', function(assert) {
  assert.expect(1);

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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

  server.get('team_memberships', function() {
    return buildResponse(200, listOfTeamMembershipsOneOfEachRole);
  });

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
