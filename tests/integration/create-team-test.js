import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { response, buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';
import { basicTeamResponse } from '../mocks/team';

var App, server;

function login(){
  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');
}

module('Team creation', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginSuccessResponse));
    });
    App = startApp();
  },

  afterEach: function() {
    // Todo - Remove this when we update Ember from 1.11.1
    // see https://github.com/emberjs/ember.js/issues/10310#issuecomment-95685137
    App.registry = App.buildRegistry();
    App.reset();
    server.shutdown();
    Ember.run(App, 'destroy');
  }
});

test('Navigation to "/create-team"', function(assert) {
  assert.expect(2);

  visit('create-team');

  andThen(function() {
    assert.equal(currentRouteName(), 'login', 'Requires authentication.');
  });

  login();
  visit('/create-team');

  andThen(function(){
    assert.equal(currentRouteName(), 'general.create-team', 'Actually navigates to "general.create-team"');
  });
});

test('Form on "/create-team"', function(assert) {
  assert.expect(4);

  visit('login');
  login();
  visit('create-team');

  andThen(function(){
    assert.equal(find('#name').length, 1, 'Contains field for team name');
    assert.equal(find('#subdomain').length, 1, 'Contains field for team subdomain');
    assert.equal(find('#create-team').length, 1, 'Contains button to submit form');
    assert.equal(find('input').length, 3, 'Contains a total of 3 controls');
  });
});

test('Form submission on "/create-team"', function(assert) {
  assert.expect(4);

  visit('login');
  login();
  visit('create-team');

  andThen(function() {
    assert.equal(find('#create-team[disabled]').length, 1, 'Is disabled when all fields are blank');
  });

  fillIn('#name', 'test');
  andThen(function() {
    assert.equal(find('#create-team[disabled]').length, 1, 'Is disabled when only name is filled in');
  });

  fillIn('#name', '');
  fillIn('#subdomain', 'test');
  andThen(function() {
    assert.equal(find('#create-team[disabled]').length, 1, 'Is disabled when only subdomain is filled in');
  });

  fillIn('#name', 'test');
  fillIn('#subdomain', 'test');
  andThen(function() {
    assert.equal(find('#create-team[disabled]').length, 0, 'Is enabled when both fields are filled in');
  });
});

test('Succesful team creation', function(assert) {
  assert.expect(3);

  visit('login');
  login();
  visit('create-team');

  fillIn('#name', 'test');
  fillIn('#subdomain', 'test');

  andThen(function() {
    server.post('teams', function() {
      assert.ok(true, 'Posts to API');
      return buildResponse(200, basicTeamResponse);
    });
    click('#create-team');
  });

  andThen(function() {
    assert.equal(find('.message').length, 1, 'Shows a success message');
    assert.notEqual(find('a.team-link').attr('href').indexOf('test'), -1, 'Shows a link with the URL for the new team site.');
  });
});

test('Failed team creation', function(assert){
  assert.expect(1);

  visit('login');
  login();
  visit('create-team');

  fillIn('#name', 'test');
  fillIn('#subdomain', 'test');

  andThen(function() {
    server.post('teams', response(403, {}));
    click('#create-team');
  });

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message');
  });
});
