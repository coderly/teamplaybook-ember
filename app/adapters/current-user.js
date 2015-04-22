import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  find: function () {
    return this.ajax(this.fullUrl('me'), 'GET');
  }
});
