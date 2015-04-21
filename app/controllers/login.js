import Ember from 'ember';

export default Ember.Controller.extend({

  username: null,
  password: null,
  showError: false,
  errorMessage: null,

  actions: {
    login: function () {
      var controller = this,
          username = controller.get('username'),
          password = controller.get('password');
      this.get('session').authenticate('authenticator:fixture', {
        username: username,
        password: password
      }).then(function () {
        controller.transitionToRoute('/');
      }, function (error) {
        controller.set('showError', true);
        controller.set('errorMessage', error.message);
      });
    }
  }
});