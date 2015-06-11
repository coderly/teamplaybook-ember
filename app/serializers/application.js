import Ember from 'ember';
import JsonApiSerializer from 'ember-json-api/json-api-serializer';

function hasManyLink(key, type, record, attr) {
  var links = Ember.A(record.hasMany(attr)).mapBy('id') || [];
  var typeName = Ember.String.pluralize(type);
  var linkages = [];
  var index, total;

  for(index=0, total=links.length; index<total; ++index) {
    linkages.push({
      id: links[index],
      type: typeName
    });
  }

  return { linkage: linkages };
}

export default JsonApiSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var attr = relationship.key;
    var type = this.keyForRelationship(relationship.type);
    var key = this.keyForRelationship(attr);

    if (relationship.kind === 'hasMany') {
      json.links = json.links || {};
      json.links[key] = hasManyLink(key, type, record, attr);
    }
  }
});