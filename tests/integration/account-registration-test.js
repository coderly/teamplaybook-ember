import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse, registrationSuccessResponse } from '../mocks/account';

var server, App;

module('Account registration', {
  beforeEach: function() {
    server = mockServer(function() {});
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

test('Succesful registration', function(assert) {
  assert.expect(3);

  visit('register');

  andThen(function() {
    server.post('accounts/', function() {
      assert.ok(true, 'Posts to API');
      return buildResponse(200, registrationSuccessResponse);
    });

    server.post('accounts/tokens', function() {
      assert.ok(true, 'Attempts to log in');
      return buildResponse(200, loginSuccessResponse);
    });
  });

  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  fillIn('#password-confirmation', '123456');
  click('#register');


  andThen(function() {
    assert.equal(currentRouteName(), 'general.index', 'Redirects to general.index');
  });
});

test('Registration form', function(assert) {
  assert.expect(5);

  visit('register');


  andThen(function() {
    assert.equal(find('#register[disabled]').length, 1, 'Is disabled when all fields are blank.');
  });

  fillIn('#email', 'test@example.com');
  andThen(function() {
    assert.equal(find('#register[disabled]').length, 1, 'Is disabled when only email is filled in.');
  });

  fillIn('#password', '12345');
  andThen(function() {
    assert.equal(find('#register[disabled]').length, 1, 'Is disabled when email and password are filled in.');
  });

  fillIn('#password-confirmation', '1234');
  andThen(function() {
    assert.equal(find('#register[disabled]').length, 1, 'Is disabled when all fields are filled in, but password and password confirmation do not match.');
  });

  fillIn('#password-confirmation', '12345');
  andThen(function() {
    assert.equal(find('#register[disabled]').length, 0, 'Is enabled when all fields are filled in and passwords match.');
  });
});

test('Failed registration', function(assert) {
  assert.expect(1);

  visit('register');

  fillIn('#email', 'test@example.com');
  fillIn('#password', '12345');
  fillIn('#password-confirmation', '12345');

  andThen(function () {
    server.post('accounts', function() {
      return buildResponse(404, {});
    });
  });

  click('#register');

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message.');
  });
});
