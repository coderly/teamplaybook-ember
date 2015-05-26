import JsonApiSerializer from 'ember-json-api/json-api-serializer';

export default JsonApiSerializer.extend({
  keyForAttribute: function(key) {
    return Ember.String.decamelize(key);
  }
});