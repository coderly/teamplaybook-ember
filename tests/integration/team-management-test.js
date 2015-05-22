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

module('Team management', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('pages', response(200, { data: [] }));
      this.get('plans', response(200, { data: [] }));
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

test('Navigation link for "manage" route is not available for regular members', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));
  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 0, "Navigation link is not present");
  });
});


test('Navigation link for "manage" route is not available for admins', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));
  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 0, "Navigation link is not present");
  });
});


test('Navigation link for "manage" route is available for team owners', function(assert) {
  assert.expect(1);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));
  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 1, "Navigation link is present");
  });
});

test('Navigating to "manage" requires authentication', function(assert) {
  assert.expect(2);

  visit('manage');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'Unauthenticated user gets redirected to "login"');
  });

  login();
  visit('manage');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.manage', 'Actually navigates to "team.manage"');
  });
});

test('Navigating to "manage" requires actually navigates to "team.manage"', function(assert) {
  assert.expect(1);

  visit('login');
  login();
  visit('manage');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.manage', 'The route name is correct');
  });
});

test('Team management page contains the button to destroy the team', function(assert) {
  assert.expect(1);

  visit('login');
  login();
  visit('manage');

  andThen(function() {
    assert.equal(find('.disband-team').length, 1, 'The button is present');
  });
});

test('Successful disbanding of team asks for confirmation and sends DELETE request to server', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('manage');

  var oldConfirm = window.confirm;

  window.confirm = function() {
    assert.ok(true, 'User is asked for confirmation');
    return true;
  };

  server.delete('teams', function() {
    assert.ok(true, 'DELETE request is sent to server');
    return buildResponse(204);
  });

  andThen(function() {
    click('.disband-team');
  });

  andThen(function() {
    window.confirm = oldConfirm;
  });

  // TODO: Should somehow figure out navigation testing - site should redirect to regular subdomain here, but we aren't sure how to test it
});

test('Failed disbanding of team shows an error message', function(assert) {
  assert.expect(1);

  visit('login');
  login();
  visit('manage');

  var oldConfirm = window.confirm;

  window.confirm = function() {
    return true;
  };

  server.delete('teams', function() {
    return buildResponse(401);
  });

  andThen(function() {
    click('.disband-team');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'An error message is shown');
  });

  andThen(function() {
    window.confirm = oldConfirm;
  });

});
