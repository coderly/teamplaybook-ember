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
      this.get('team-memberships', response(200, listOfTeamMembershipsOneOfEachRole));
      this.get('users', response(200, listOfUsersOneForEachRole));
      this.get('pages', response(200, { data: [] }));
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

test('Team membership creation form on "/members" has all of the required fields', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('#email').length, 1, 'There is an email field.');
    assert.equal(find('#create-membership').length, 1, 'There is a submit button.');
    assert.equal(find('input').length, 2, 'There are two controls in total.');
  });
});

test('Team membership creation form on "/members" has proper validations in place', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('members');

  andThen(function() {
    assert.equal(find('#create-membership[disabled]').length, 1, 'Form is disabled when email is not filled in');
  });

  fillIn('#email', 'membership@test.com');
  andThen(function() {
    assert.equal(find('#create-membership[disabled]').length, 0, 'Form is enabled when email is filled in');
  });
});

test('Succesful team membership creation POSTs to API, adds the membership to the list and shows a success message', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('members');

  fillIn('#email', 'membership@test.com');

  andThen(function() {
    server.post('team-memberships', function() {
      assert.ok(true, 'There was an API POST request.');
      return buildResponse(200, basicTeamMembershipResponse);
    });
    click('#create-membership');
  });

  andThen(function() {
    assert.equal(find('.message').length, 1, 'A success message is shown');
    assert.equal(find('.team-membership').length, 5, 'The new membership is added to the list');
  });
});

test('Failed team membership creation shows an error message', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('members');

  fillIn('#email', 'test');

  andThen(function() {
    server.post('team-memberships', response(403, {}));
    click('#create-membership');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'An error message is shown');
  });
});
