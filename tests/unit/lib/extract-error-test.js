import { test, module } from 'qunit';
import extractError from 'teamplaybook-ember/lib/extract-error';

module('Library: extract-error');

test('Returns "Unknown error." for null input', function(assert) {
  assert.expect(1);
  assert.equal(extractError(null), 'Unknown error.');
});

test('Returns "Unknown error." for unparsable input', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ randomData: 'Whoa!' }), 'Unknown error.');
});

test('Returns value of "errorThrown" if present', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ errorThrown: 'A message.' }), 'A message.');
});

test('Returns value of "message" if present and is a string', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ message: 'A message.' }), 'A message.');
});

test('Returns value of "message.error" if "message" is present and has "error" property', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ message: { error: 'A message.' } }), 'A message.');
});

test('Returns "Unknown error." if "message" is present as object, but has no "error" property', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ message: { } }), 'Unknown error.');
});

test('Returns value of "error" if present and is a string', function(assert) {
  assert.expect(1);
  assert.equal(extractError({ error: 'A message.' }), 'A message.');
});

test('Returns string if input value is a string', function(assert) {
  assert.expect(1);
  assert.equal(extractError('A message.'), 'A message.');
});