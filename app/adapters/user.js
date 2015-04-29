import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function() {
    var url = [];
    url.push(this.get('host'));
    url.push('users');

    return url.join('/');
  }
});
