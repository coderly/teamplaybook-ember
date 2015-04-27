import { test, module } from 'qunit';
import { extractBaseUrlFromHostname, extractSubdomainFromHostname } from 'teamplaybook-ember/lib/url-utils';

module('Library: URL utils');

test('extractBaseUrlFromHostname', function (assert) {
  assert.expect(6);

  assert.equal(extractBaseUrlFromHostname(''), null, 'Returns null for empty string as hostname');
  assert.equal(extractBaseUrlFromHostname('localhost'), 'localhost', 'Returns single word for single word as hostname');
  assert.equal(extractBaseUrlFromHostname('google.com'), 'google.com', 'Returns host and tld for host and tld as hostname');
  assert.equal(extractBaseUrlFromHostname('www.google.com'), 'google.com', 'Returns host and tld for full hostname');
  assert.equal(extractBaseUrlFromHostname('some.random.example.com'), 'example.com', 'Returns host and tld for hosts longer than 3 parts');
  assert.equal(extractBaseUrlFromHostname('www.goo-gle.com'), 'goo-gle.com', 'Is not affected by dashes');
});

test('extractSubdomainFromHostname', function (assert) {
  assert.expect(8);

  assert.equal(extractSubdomainFromHostname(''), '', 'Returns empty string for empty string as hostname');
  assert.equal(extractSubdomainFromHostname('localhost'), '', 'Returns empty string for hostname with single part');
  assert.equal(extractSubdomainFromHostname('subdomain.localhost'), 'subdomain', 'If final part is longer than 5 characters, it\'s not a tld part, the one before that is the subdomain');
  assert.equal(extractSubdomainFromHostname('google.com'), '', 'Returns empty string for hostname with two parts');
  assert.equal(extractSubdomainFromHostname('www.google.com'), 'www', 'Returns first part for hostname with at least 3 parts');
  assert.equal(extractSubdomainFromHostname('some.random.example.com'), 'some.random', 'Returns first n-2 parts for hostname with n > 2 parts');
  assert.equal(extractSubdomainFromHostname('dashed-subdomain.example.com'), 'dashed-subdomain', 'Is not affected by dashes in subdomain');
  assert.equal(extractSubdomainFromHostname('subdomain.dashed-domain.com'), 'subdomain', 'Is not affected by dashes in the other parts of the hostname');
});
