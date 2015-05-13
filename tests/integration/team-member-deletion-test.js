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

module('Team member deletion', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));
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

test('A regular member cannot remove another team member', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 0, 'Delete button is not present');
  });
});

test('An ddmin cannot remove another team member', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 0, 'Delete button is not present');
  });
});

test('An owner can remove another team member', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('.invitee .delete').length, 1, 'Delete button is present');
  });
});

test('A succesful delete process POSTs to server, removes member and shows success message', function(assert) {
  assert.expect(3);

  server.delete('team-memberships/invitee', function() {
    assert.ok(true, 'There is a POST request to the API');
    return buildResponse(204);
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    click('.invitee .delete');
  });

  andThen(function() {
    assert.equal(find('.message').length, 1, 'A success message is shown');
    assert.equal(find('.team-membership').length, 3, 'The membership is removed from the list');
  });
});

test('A failed deletion process shows an error message', function(assert) {
  assert.expect(1);

  server.delete('team-memberships/invitee', function() {
    return buildResponse(405);
  });

  visit('login');
  login();
  visit('members');

  andThen(function() {
    click('.invitee .delete');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'An error message is visible');
  });
});
