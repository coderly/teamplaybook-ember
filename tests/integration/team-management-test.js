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

test('Navigation link for "manage" route', function(assert) {
  assert.expect(3);

  server.post('accounts/tokens', response(200, loginResponseForSpecificRole('member')));
  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 0, "Is not available for members");
    server.post('accounts/tokens', response(200, loginResponseForSpecificRole('admin')));
  });

  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 0, "Is not available for admins");
    server.post('accounts/tokens', response(200, loginResponseForSpecificRole('owner')));
  });

  visit('login');
  login();
  visit('/');
  andThen(function() {
    assert.equal(find('a[href="/manage"]').length, 1, "Is available for owners");
  });
});

test('Navigating to "manage"', function(assert) {
  assert.expect(2);

  visit('manage');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'Requires authentication');
  });

  login();
  visit('manage');

  andThen(function() {
    assert.equal(currentRouteName(), 'team.manage', 'Actually navigates to "team.manage"');
  });
});

test('Team management page', function(assert) {
  assert.expect(1);

  visit('login');
  login();
  visit('manage');

  andThen(function() {
    assert.equal(find('.disband-team').length, 1, 'Contains the button to destroy the team');
  });
});

test('Successful "Disband team"', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('manage');

  var oldConfirm = window.confirm;

  window.confirm = function() {
    assert.ok(true, 'Asks for confirmation by the user');
    return true;
  };

  server.delete('teams', function() {
    assert.ok(true, 'Sends DELETE request to server');
    return buildResponse(204);
  });

  andThen(function() {
    click('.disband-team');
  });

  andThen(function() {
    window.confirm = oldConfirm;
  });

  // TODO: Should somehow figure out navigation testing - site should redirec to regular subdomain here, but we aren't sure how to test it
});

test('Failed "Disband team"', function(assert) {
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
    assert.equal(find('.error').length, 1, 'Shows an error message');
  });

  andThen(function() {
    window.confirm = oldConfirm;
  });

});