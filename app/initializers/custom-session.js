import Session from 'simple-auth/session';

export default {
  name: 'custom-session',
  before: 'simple-auth',
  initialize: function(container) {
    Session.reopen({
      user: function() {
        return container.lookup('store:main').find('current-user', 'active');
      }.property('secure')
    });
  }
};
