import ApplicationSerializer from 'teamplaybook-ember/serializers/application';

export default ApplicationSerializer.extend({
  typeForRoot: function (prop) {
    if (prop === 'users') {
      return 'currentUser';
    } else {
      return this._super(prop);
    }
  }
});
