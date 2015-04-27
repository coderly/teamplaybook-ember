import ApplicationSerializer from 'teamplaybook-ember/serializers/application';

export default ApplicationSerializer.extend({
  typeForRoot: function() {
    return 'currentUser';
  }
});
