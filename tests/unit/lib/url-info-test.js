import { test, module } from 'qunit';
import UrlInfo from 'teamplaybook-ember/lib/url-info';

module('Library: URL info');

test('subdomain', function(assert) {
  assert.expect(4);

  UrlInfo.reopenClass({ hostname: null });
  var urlInfo = UrlInfo.create();

  urlInfo.set('hostname', 'localhost');
  assert.equal(urlInfo.get('subdomain'), 'default', 'No subdomain is mapped to "default"');

  urlInfo.set('hostname', 'www.example.com');
  assert.equal(urlInfo.get('subdomain'), 'default', '"www" is mapped to "default"');

  urlInfo.set('hostname', 'test1.localhost');
  assert.equal(urlInfo.get('subdomain'), 'test1', 'returns actual subdomain if it exists on localhost');

  urlInfo.set('hostname', 'test1.example.com');
  assert.equal(urlInfo.get('subdomain'), 'test1', 'returns actual subdomain if it exists on public url');
});


test('isOnRegularSubdomain', function(assert) {
  assert.expect(4);

  UrlInfo.reopenClass({ hostname: null });
  var urlInfo = UrlInfo.create();

  urlInfo.set('hostname', 'localhost');
  assert.equal(urlInfo.get('isOnRegularSubdomain'), true, 'Returns true for no subdomain');

  urlInfo.set('hostname', 'www.example.com');
  assert.equal(urlInfo.get('isOnRegularSubdomain'), true, 'Returns true for "www"');

  urlInfo.set('hostname', 'test1.localhost');
  assert.equal(urlInfo.get('isOnRegularSubdomain'), false, 'Returns false for format "subdomain.localhost"');

  urlInfo.set('hostname', 'test1.example.com');
  assert.equal(urlInfo.get('isOnRegularSubdomain'), false, 'Returns false for format "subdomain.example.com"');

});

test('isOnTeamSubdomain', function(assert) {
  assert.expect(4);

  UrlInfo.reopenClass({ hostname: null });
  var urlInfo = UrlInfo.create();

  urlInfo.set('hostname', 'localhost');
  assert.equal(urlInfo.get('isOnTeamSubdomain'), false, 'Returns false for no subdomain');

  urlInfo.set('hostname', 'www.example.com');
  assert.equal(urlInfo.get('isOnTeamSubdomain'), false, 'Returns false for "www"');

  urlInfo.set('hostname', 'test1.localhost');
  assert.equal(urlInfo.get('isOnTeamSubdomain'), true, 'Returns true for format "subdomain.localhost"');

  urlInfo.set('hostname', 'test1.example.com');
  assert.equal(urlInfo.get('isOnTeamSubdomain'), true, 'Returns true for format "subdomain.example.com"');

});

test('_buildUrl', function(assert) {
  assert.expect(1);

  var urlInfo = UrlInfo.create();

  assert.equal(urlInfo._buildUrl('https:', 'test', 'example.com', '80'), 'https://test.example.com:80', 'Correctly build URL from parameters.');
});

test('urlForSubdomain', function(assert) {
  assert.expect(1);

  UrlInfo.reopenClass({ hostname: null, port: null, protocol: null});
  var urlInfo = UrlInfo.create();

  urlInfo.setProperties({ hostname: 'example.com', port: 20, protocol: 'https:'});
  assert.equal(urlInfo.urlForSubdomain('test'), 'https://test.example.com:20');
});

test('apiUrl', function(assert) {
  assert.expect(2);

  UrlInfo.reopenClass({ subdomain: null, apiUrlSetting: null });
  var urlInfo = UrlInfo.create();

  urlInfo.setProperties({ subdomain: 'test', apiUrlSetting: 'https://subdomain.example.com'});
  assert.equal(urlInfo.get('apiUrl'), 'https://test.example.com', 'Returns correct value for subdomain API');

  urlInfo.setProperties({ subdomain: 'default', apiUrlSetting: 'https://example.com'});
  assert.equal(urlInfo.get('apiUrl'), 'https://example.com', 'Returns correct value for regular API');
});

