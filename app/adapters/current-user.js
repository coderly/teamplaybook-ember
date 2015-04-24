import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function () {
    return this.get('host') + '/me';
  }
});
