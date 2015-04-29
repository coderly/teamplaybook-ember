import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import { buildResponse } from '../helpers/response';
import mockServer from '../helpers/mock-server';
import Ember from 'ember';

import { loginSuccessResponse } from '../mocks/account';

var server, App;

module('Account authentication', {
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

test('Succesful login', function(assert) {
  assert.expect(2);

  visit('login');

  andThen(function() {
    server.post('accounts/tokens', function() {
      assert.ok(true, 'Posts to API');
      return buildResponse(200, loginSuccessResponse);
    });
  });

  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');

  andThen(function() {
    assert.equal(currentRouteName(), 'general.index', 'Redirects to general.index');
  });
});

test('Failed login', function(assert) {
  assert.expect(1);

  visit('login');

  andThen(function() {
    server.post('accounts/tokens', function() {
      return buildResponse(403, {});
    });
  });

  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');

  andThen(function() {
    assert.equal(find('.error').length, 1, 'Shows an error message.');
  });
});

test('Login form', function(assert) {
  assert.expect(3);

  visit('login');


  andThen(function() {
    assert.equal(find('#login[disabled]').length, 1, 'Is disabled when all fields are blank.');
  });

  fillIn('#email', 'test@example.com');
  andThen(function() {
    assert.equal(find('#login[disabled]').length, 1, 'Is disabled when only email is filled in.');
  });

  fillIn('#password', '12345');
  andThen(function() {
    assert.equal(find('#login[disabled]').length, 0, 'Is enabled when email and password are filled in.');
  });
});
