import Ember from 'ember';
import { test, module } from 'qunit';

import startApp from '../helpers/start-app';
import login from '../helpers/login';
import mockServer from '../helpers/mock-server';
import { response, buildResponse } from '../helpers/response';

import { loginSuccessResponse } from '../mocks/account';
import { teamResponseWithOwnerLinkage } from '../mocks/team';
import listOfPages from '../mocks/pages';

var App, server;

module('Pages list', {
  beforeEach: function() {
    server = mockServer(function() {
      this.post('accounts/tokens', response(200, loginSuccessResponse));
      this.get('team', response(200, teamResponseWithOwnerLinkage));
      this.get('pages', response(200, listOfPages));
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

test('Root nodes of the pages tree', function(assert) {
  assert.expect(2);

  visit('login');
  login();
  visit('/pages');

  andThen(function() {
    assert.equal(find('.pages-tree > .page-node:first a:first').text(), "Westeros");
    assert.equal(find('.pages-tree > .page-node').size(), 1);
  });
});

test('Child nodes', function(assert) {
  assert.expect(5);

  visit('login');
  login();
  visit('/pages');

  andThen(function() {
    assert.equal(find('.pages-tree .page-node:first .page-node').size(), 8);
    assert.equal(find('.pages-tree .page-node:first > ul > li > .page-node').size(), 3);
    assert.equal(find('.pages-tree .page-node:first > ul > li > .page-node:first > ul > li > .page-node').size(), 2);
    assert.equal(find('.pages-tree .page-node:first > ul > li > .page-node:eq(1) > ul > li > .page-node').size(), 1);
    assert.equal(find('.pages-tree .page-node:first > ul > li > .page-node:last > ul > li > .page-node').size(), 2);
  });
});

test('Navigate to page', function(assert) {
  assert.expect(6);

  visit('login');
  login();
  visit('/pages');

  andThen(function() {
    click(".pages-tree .page-node:first > a:first");
  });

  andThen(function() {
    assert.equal(find('.page-expanded .page-title .content').text(), "Westeros");
    assert.equal(find('.page-expanded .page-body .content').text(), "Fake place from a book series for nerds");
    click(".pages-tree .page-node:first > ul > li > .page-node:first > a:first");
  });

  andThen(function() {
    assert.equal(find('.page-expanded .page-title .content').text(), "The North");
    assert.equal(find('.page-expanded .page-body .content').text(), "It's really cold");
    click(".pages-tree .page-node:first > ul > li > .page-node:first > ul > li > .page-node:first a:first");
  });

  andThen(function() {
    assert.equal(find('.page-expanded .page-title .content').text(), "Winterfell");
    assert.equal(find('.page-expanded .page-body .content').text(), "Home of the house Stark");
  });

});
