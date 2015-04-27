import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function(path) {
    return this.get('host') + '/' + path;
  },

  find: function() {
    return this.ajax(this.buildURL('me'), 'GET');
  },

  createRecord: function(store, type, snapshot) {
    var data = this._serializeData(store, type, snapshot);

    return this.ajax(this.buildURL('users'), 'POST', { data: data });
  }
});
