import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function (typeName, id) {
    var url = [];

    url.push(this.get('host'));

    var isFetchingCurrentTeam = (id === 'current');
    var apiEndpoint = '';

    if (isFetchingCurrentTeam) {
      apiEndpoint = 'team';
    } else {
      apiEndpoint = 'teams';
    }

    url.push(apiEndpoint);

    return url.join('/');
  }
});
