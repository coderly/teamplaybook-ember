import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response, buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';
import { basicTeamResponse } from '../mocks/team';
import { basicTeamMembershipResponse, listOfNTeamMembershipsResponseBuilder } from '../mocks/team-membership';

var App, server;

function login(){
  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');
}

module('Team memberships', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginSuccessResponse));
      this.get('team', response(200, basicTeamResponse));
      this.get('team_memberships', response(200, listOfNTeamMembershipsResponseBuilder(1)));
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

test('Navigating to "/invites"', function(assert) {
  assert.expect(2);

  visit('invites');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'Requires authentication.');
  });

  login();

  visit('invites');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.team-memberships.index', 'Actually navigates to "team.team-memberships.index".');
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
  visit('invites');

  andThen(function() {
    assert.equal(find('tbody tr').length, 5, 'Shows an entry for each team membership.');
  });
});

test('Form on "/invites"', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('invites');

  andThen(function() {
    assert.equal(find('#email').length, 1, 'Shows an email field for creating a new membership.');
    assert.equal(find('#create-membership').length, 1, 'Shows a button to submit the form.');
    assert.equal(find('input').length, 2, 'Shows a total of 2 controls.');
  });
});

test('Form submission on "/invites"', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('invites');

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
  visit('invites');

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
    assert.equal(find('tbody tr').length, 2, 'Adds the membership to the list.');
  });
});

test('Failed team membership creation', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('invites');

  fillIn('#email', 'test');

  andThen(function() {
    server.post('team_memberships', response(403, {}));
    click('#create-membership');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message');
  });
});


