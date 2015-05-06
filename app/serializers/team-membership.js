import Ember from 'ember';
import ApplicationSerializer from 'teamplaybook-ember/serializers/application';

export default ApplicationSerializer.extend({
  serialize: function(snapshot, options) {
    var data = this._super(snapshot, options);

    if(data.hasOwnProperty('role')) {
      data.roles = [data.role];
      delete data.role;
    }

    return data;
  },

  normalize: function(type, hash, prop) {
    if (Ember.isPresent(hash.roles)) {
      hash.role = hash.roles[0];
      delete hash.roles;
    }

    return this._super(type, hash, prop);
  }
});