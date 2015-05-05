import ApplicationAdapter from 'teamplaybook-ember/adapters/application';

export default ApplicationAdapter.extend({
  buildURL: function(type, id, snapshot) {
    var url = [this._super.apply(this, arguments)];

    if (snapshot) {
      var isPromoting = (snapshot.attr('role') === 'admin');
      var isDemoting = (snapshot.attr('role') === 'member');
      var isSpecialAction = isPromoting || isDemoting;

      var action = '';

      if (isPromoting) {
        action = 'promote';
      } else if (isDemoting) {
        action = 'demote';
      }

      if (isSpecialAction) {
        url.push(action);
      }

    }
    return url.join('/');
  }
});
