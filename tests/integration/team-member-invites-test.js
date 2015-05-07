import Ember from 'ember';
import { test, module } from 'qunit';

import startApp from '../helpers/start-app';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import { response, buildResponse } from '../helpers/response';

import { loginSuccessResponse } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import { basicTeamMembershipResponse, listOfTeamMembershipsOneOfEachRole } from '../mocks/team-membership';
import { listOfUsersOneForEachRole } from '../mocks/user';

var App, server;

module('Team member invites', {
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

test('Team membership creation form on "/members"', function(assert) {
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

test('Team membership creation form submission on "/members"', function(assert) {
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
    assert.equal(find('.team-membership').length, 5, 'Adds the membership to the list.');
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
