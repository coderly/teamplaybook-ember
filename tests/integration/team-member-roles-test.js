import Ember from 'ember';
import { test, module } from 'qunit';

import startApp from '../helpers/start-app';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import { response, buildResponse } from '../helpers/response';

import { loginResponseForSpecificRole } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import { listOfTeamMembershipsOneOfEachRole } from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';
var App, server;

module('Team member roles', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('team-memberships', response(200, listOfTeamMembershipsOneOfEachRole));
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

test('A team member cannot change the role of a user', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.member .role.actions').length, 0, 'Actions to change role are not available');
  });
});

test('A team admin can change the role of a user', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.member .role.actions').length, 1, 'Actions to change role are available');
  });
});

test('A team owner can change the role of a user', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.member .role.actions').length, 1, 'Actions to change role are available');
  });
});

test('An invitee cannot have their role changed', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .role.actions').length, 0, 'Actions to change role are not available');
  });
});

test('A member can have their role changed', function(assert){
  assert.expect(2);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.member .role.actions .set-member[disabled]').length, 1, 'Action to demote to member is rendered, but disabled');
    assert.equal(find('.member .role.actions .set-admin').length, 1, 'Action to promote to admin is rendered and enabled');
  });
});

test('An admin can have their role changed', function(assert){
  assert.expect(2);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.admin .role.actions .set-member').length, 1, 'Action to demote to member is rendered');
    assert.equal(find('.admin .role.actions .set-admin[disabled]').length, 1, 'Action to promote to admin is rendered, but disabled');
  });
});

test('An owner cannot have ther role changed', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.owner .role.actions').length, 0, 'Actions to change role are not available');
  });
});

test('Setting role to "admin" sends a PATCH request to API, with the correct payload', function(assert) {
  assert.expect(1);

  server.patch('team-memberships/member', function(request){
    var body = JSON.parse(request.requestBody);
    assert.equal(body.data.roles.indexOf('admin'), 0, 'There is a PATCH to API with roles property set to array containing "admin" item');
    return buildResponse(200, body);
  });

  visit('login');
  login();
  visit('members');
  andThen(function() {
    click('.member .set-admin');
  });
});

test('Setting role to "member" sends a PATCH request to API, with the correct payload', function(assert) {
  assert.expect(1);

  server.patch('team-memberships/admin', function(request){
    var body = JSON.parse(request.requestBody);
    assert.equal(body.data.roles.indexOf('member'), 0, 'There is a PATCH to API with roles property set to array containing "member" item');
    return buildResponse(200, body);
  });

  visit('login');
  login();
  visit('members');
  andThen(function() {
    click('.admin .set-member');
  });
});
