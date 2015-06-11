import ApplicationSerializer from 'teamplaybook-ember/serializers/application';

export default ApplicationSerializer.extend({
  modelNameFromPayloadKey: function() {
    return 'currentUser';
  }
});
